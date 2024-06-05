import { HubsWorld } from "../app";
import {
    defineQuery, enterQuery, exitQuery, hasComponent, addComponent, addEntity
} from "bitecs";

import { Interacted, TFCKeyboardButton } from "../bit-components";
import { createUIButton } from "../tfl-libs/myButton";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { AnimationClip, Object3D, LoopOnce, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import { findAncestorWithComponent } from "../utils/scene-graph";
import { button } from "leva";

const TFCKeyboardButtonQuery = defineQuery([TFCKeyboardButton]);
const TFCKeyboardButtonEnterQuery = enterQuery(TFCKeyboardButtonQuery);
const TFCKeyboardButtonExitQuery = exitQuery(TFCKeyboardButtonQuery);

let currentValue = "";
const objectsInScene: THREE.Object3D[] = [];
const listKeyboardButton: THREE.Object3D[] = [];
let resultValue = "";
let notificationParent: THREE.Object3D;
let notificationScreen: THREE.Object3D;
let notificationTime = 0; // seconds
let notificationTimeLimit = 2; // seconds
let notificationScreenOn = false;

function clicked(world: HubsWorld, entity: number): boolean {
    return hasComponent(world, Interacted, entity);
}

export function TFCKeyboardButtonSystem(world: HubsWorld) {
    const myButtonEid = anyEntityWith(world, TFCKeyboardButton);

    if (myButtonEid !== null) {
        if (notificationScreenOn) {
            notificationTime += 1;
            if (notificationTime >= notificationTimeLimit * 30) {
                notificationTime = 0;
                notificationScreenOn = false;
                world.scene.remove(notificationScreen);
            }
        } else {
            if (notificationScreen) {
                world.scene.remove(notificationScreen);
            }
        }

        const entered = TFCKeyboardButtonEnterQuery(world);

        entered.forEach((eid) => {
            const action = APP.getString(TFCKeyboardButton.action[eid]);
            const content = APP.getString(TFCKeyboardButton.value[eid])!;
            const myButton = world.eid2obj.get(eid)!;
            const buttonChildrent = myButton?.parent?.parent?.children!;

            let buttonImage = '';
            let buttonLink = '';
            let buttonText = '';
            if (buttonChildrent.length > 2) {
                for (let i = 0; i < buttonChildrent.length; i++) {
                    const buttonChild = buttonChildrent[i];
                    if (buttonChild.children[0] === undefined) {
                        continue;
                    }

                    const buttonData = buttonChild.children[0].userData;

                    if (buttonChild.name.includes('image')) {
                        buttonImage = buttonData.gltfExtensions.MOZ_hubs_components.image.src;
                        TFCKeyboardButton.buttonImage[eid] = APP.getSid(buttonImage);
                    }
                    if (buttonChild.name.includes('link')) {
                        buttonLink = buttonData.gltfExtensions.MOZ_hubs_components.link.href;
                        TFCKeyboardButton.buttonLink[eid] = APP.getSid(buttonLink);
                    }
                    if (buttonChild.name.includes('text')) {
                        buttonText = buttonData.gltfExtensions.MOZ_hubs_components.text.value;
                        TFCKeyboardButton.buttonText[eid] = APP.getSid(buttonText);
                    }
                }
            }

            if (myButton) {
                const myButtonPosition = new THREE.Vector3();
                myButton.getWorldPosition(myButtonPosition);

                // Get the world rotation of myButton object
                const myButtonRotation = new THREE.Quaternion();
                myButton.getWorldQuaternion(myButtonRotation);

                // Get the world scale of myButton object
                const myButtonScale = new THREE.Vector3();
                myButton.getWorldScale(myButtonScale);

                (myButton.children[0] as THREE.Mesh).material = new MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.0 });

                let value = "0";
                let background_img_src = 'https://localhost:4000/files/3c0d1ba0-d65f-4e87-a157-045bd4a40116.png'
                let btn_width = 1.6;
                let btn_height = 0.4;
                let text_color = "#000000";
                let font_size = 16;

                if (action === '0' || action === '1' || action === '2') {// Number                
                    value = buttonText;
                    btn_width = 0.20;
                    btn_height = 0.20;
                    background_img_src = "#ffffff";
                }

                if (action === '3') {// Function
                    btn_width = 0.20;
                    btn_height = 0.20;
                    background_img_src = "#007AB8";
                    text_color = "#ffffff";
                    font_size = 16;
                    value = buttonText;
                    if (buttonText === 'enter') {
                        value = "⏎";
                    }
                    if (buttonText === 'clear') {
                        value = "C";
                    }
                    if (buttonText === 'del') {
                        value = "⌫";
                        font_size = 12;
                    }
                }

                if (action === '4') {// screen
                    btn_width = 0.82;
                    btn_height = 0.20;
                    background_img_src = "#ffffff";
                    value = '';
                    if (buttonText === 'notification') {
                        background_img_src = "#008000";
                        notificationParent = myButton;
                    }
                }

                if (buttonText !== 'notification') {
                    const myKeyboardButton = createUIButton({
                        width: btn_width,
                        height: btn_height,
                        backgroundColor: background_img_src,
                        textColor: text_color,
                        text: value,
                        fontSize: font_size,
                        font: "Arial"
                    });

                    myKeyboardButton.position.copy(myButtonPosition);

                    myKeyboardButton.position.z += action === '1' ? 0.001 : 0.01;
                    const myKeyboardButtonEid = addEntity(world);
                    addObject3DComponent(world, myKeyboardButtonEid, myKeyboardButton);
                    world.scene.add(myKeyboardButton);
                    listKeyboardButton.push(myKeyboardButton);
                    objectsInScene.push(myKeyboardButton);
                }
            }
        });
    }

    const exited = TFCKeyboardButtonExitQuery(world);
    exited.forEach((eid) => {
        objectsInScene.forEach(object => world.scene.remove(object));
        objectsInScene.length = 0;

        listKeyboardButton.forEach(object => world.scene.remove(object));
        listKeyboardButton.length = 0;
    });

    const entities = TFCKeyboardButtonQuery(world);
    entities.forEach((eid) => {
        if (clicked(world, eid)) {
            const myButton = world.eid2obj.get(eid)!;
            const action = APP.getString(TFCKeyboardButton.action[eid]);
            console.log('TFCMyButton action', action);
            const value = APP.getString(TFCKeyboardButton.value[eid])!;
            console.log('TFCMyButton content', value);
            const buttonImage = APP.getString(TFCKeyboardButton.buttonImage[eid]);
            console.log('TFCMyButton buttonImage', buttonImage);
            const buttonLink = APP.getString(TFCKeyboardButton.buttonLink[eid])!;
            console.log('TFCMyButton buttonLink', buttonLink);
            const buttonText = APP.getString(TFCKeyboardButton.buttonText[eid])!;
            console.log('TFCMyButton buttonText', buttonText);
            // Merge the value to the current value
            if (action === '0') { // Number
                if (currentValue.length >= 5) {
                    createNotificationScreen(world, '5자 이내 입력.')
                    return;
                }
                currentValue += buttonText;
                updateScreen(world);
            } else if (action === '1') { // Character
                if (currentValue.length >= 5) {
                    createNotificationScreen(world, '5자 이내 입력.')
                    return;
                }
                currentValue += buttonText;
                updateScreen(world);
            } else if (action === '2') { // Operator
                switch (buttonText) {
                    case '&plus;':
                        currentValue += '+';
                        break;
                    case '&minus;':
                        currentValue += '-';
                        break;
                    case '&times;':
                        currentValue += '*';
                        break;
                    case '&divide;':
                        currentValue += '/';
                        break;
                    case '&equals;':
                        currentValue += '=';
                        break;
                    case '&ne;':
                        currentValue += '!=';
                        break;
                    case '&lt;':
                        currentValue += '<';
                        break;
                    case '&gt;':
                        currentValue += '>';
                        break;
                    case '&le;':
                        currentValue += '<=';
                        break;
                    case '&ge;':
                        currentValue += '>=';
                        break;
                    case '&infin;':
                        currentValue += 'Infinity';
                        break;
                    case '&pi;':
                        currentValue += 'Math.PI';
                        break;
                    case '&radic;':
                        currentValue += 'Math.sqrt';
                        break;
                    case '&perp;':
                        currentValue += 'Math.pow';
                        break;
                    case '&ang;':
                        currentValue += 'angle';
                        break;
                    case '&deg;':
                        currentValue += 'degree';
                        break;
                }
            } else if (action === '3') { // Function
                switch (buttonText) {
                    case 'del':
                        // Remove the last character
                        currentValue = currentValue.substring(0, currentValue.length - 1);
                        updateScreen(world);
                        break;
                    case 'clear':
                        currentValue = '';
                        updateScreen(world);
                        break;
                    case 'enter':
                        createNotificationScreen(world, "현재 값: " + currentValue)
                }
            }

            console.log('TFCKeyboardButton currentValue', currentValue);
        }
    });
}

function updateScreen(world: HubsWorld) {
    // Get the last object from listKeyboardButton
    const lastObject = listKeyboardButton[listKeyboardButton.length - 1];
    const lastObjectPosition = lastObject.position;
    // Remove the last object from the scene
    world.scene.remove(lastObject);
    // Remove the last object from the list
    listKeyboardButton.pop();
    const btn_width = 0.82;
    const btn_height = 0.20;
    const background_img_src = "#ffffff";
    const value = currentValue;

    const myKeyboardButton = createUIButton({
        width: btn_width,
        height: btn_height,
        backgroundColor: background_img_src,
        textColor: '#000000',
        text: value,
        fontSize: 16,
        font: "Arial"
    });

    myKeyboardButton.position.copy(lastObjectPosition);

    myKeyboardButton.position.z += 0.001;
    const myKeyboardButtonEid = addEntity(world);
    addObject3DComponent(world, myKeyboardButtonEid, myKeyboardButton);
    world.scene.add(myKeyboardButton);
    listKeyboardButton.push(myKeyboardButton);
}

function createNotificationScreen(world: HubsWorld, content: string) {
    if (notificationScreen) {
        world.scene.remove(notificationScreen);
    }
    const btn_width = 0.82;
    const btn_height = 0.20;
    const background_img_src = "#008000";
    const value = content;
    notificationScreen = createUIButton({
        width: btn_width,
        height: btn_height,
        backgroundColor: background_img_src,
        textColor: '#ffffff',
        text: value,
        fontSize: 9,
        font: "Arial"
    });

    const myButtonPosition = new THREE.Vector3();
    notificationParent.getWorldPosition(myButtonPosition);

    // Get the world rotation of myButton object
    const myButtonRotation = new THREE.Quaternion();
    notificationParent.getWorldQuaternion(myButtonRotation);

    // Get the world scale of myButton object
    const myButtonScale = new THREE.Vector3();
    notificationParent.getWorldScale(myButtonScale);

    notificationScreen.position.copy(myButtonPosition);
    notificationScreen.position.z += 0.01;
    world.scene.add(notificationScreen);
    notificationScreenOn = true;
    notificationTime = 0;
}