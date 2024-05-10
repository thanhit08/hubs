import { HubsWorld } from "../app";
import { defineQuery, enterQuery, exitQuery, hasComponent, Not, entityExists, addComponent, addEntity } from "bitecs";
import { Interacted, TFCMyButton } from "../bit-components";
import { createUIButton } from "../tfl-libs/myButton";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { WebGLContentModalContainer } from "../react-components/room/WebGLContentModalContainer";
import UIRoot from "../react-components/ui-root";

const TFCMyButtonQuery = defineQuery([TFCMyButton]);
const TFCMyButtonEnterQuery = enterQuery(TFCMyButtonQuery);
const TFCMyButtonExitQuery = exitQuery(TFCMyButtonQuery);

const objectsInScene: THREE.Object3D[] = [];

function clicked(world: HubsWorld, entity: number) {
    return hasComponent(world, Interacted, entity);
}

export function TFCMyButtonSystem(world: HubsWorld) {
    const myButtonEid = anyEntityWith(world, TFCMyButton);
    if (myButtonEid !== null) {

        const entered = TFCMyButtonEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            const entity = entered[i];
            console.log('TFCMyButton entered', entity);
            // Get the entity's TFCMyButton component
            const action = APP.getString(TFCMyButton.action[entity]);
            console.log('TFCMyButton action', action);
            const content = APP.getString(TFCMyButton.content[entity])!;
            console.log('TFCMyButton content', content);
            const myButton = world.eid2obj.get(entity);
            const buttonChildrent = myButton?.parent?.parent?.children!;
            if (buttonChildrent.length > 2) {
                for (let i = 0; i < buttonChildrent.length; i++) {
                    const buttonChild = buttonChildrent[i];
                    if (buttonChild.name === 'image') {
                        const buttonData = buttonChild.children[0].userData;
                        // Query the data inside the buttondata 
                        // buttonData -> gltfExtension -> MOZ_hubs_components -> image
                        const buttonImage = buttonData.gltfExtensions.MOZ_hubs_components.image.src;
                        console.log('buttonImage', buttonImage);
                    }
                    if (buttonChild.name === 'link') {
                        const buttonData = buttonChild.children[0].userData;
                        // Query the data inside the buttondata
                        // buttonData -> gltfExtension -> MOZ_hubs_components -> link
                        const buttonLink = buttonData.gltfExtensions.MOZ_hubs_components.link.href;
                        console.log('buttonLink', buttonLink);
                    }
                    if (buttonChild.name === 'text') {
                        const buttonData = buttonChild.children[0].userData;
                        // Query the data inside the buttondata
                        // buttonData -> gltfExtension -> MOZ_hubs_components -> text
                        console.log(buttonData);
                        const buttonText = buttonData.gltfExtensions.MOZ_hubs_components.text.value;
                        console.log('buttonText', buttonText);
                    }
                }
            }


            if (myButton) {
                // myButton.visible = false;
                const myButtonPosition = new THREE.Vector3();
                myButton.getWorldPosition(myButtonPosition);

                // Get the world rotation of myButton object
                const myButtonRotation = new THREE.Quaternion();
                myButton.getWorldQuaternion(myButtonRotation);

                // Get the world scale of myButton object
                const myButtonScale = new THREE.Vector3();
                myButton.getWorldScale(myButtonScale);

                const myMilling01ButtonEid = addEntity(world);
                // Change the material of the button
                const newMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.0 });
                (myButton.children[0] as THREE.Mesh).material = newMaterial;

                let content_type = content.split("_")[0];
                let background_img_src = 'https://localhost:4000/files/3c0d1ba0-d65f-4e87-a157-045bd4a40116.png'
                let btn_width = 1.6;
                let btn_height = 0.4;
                if (action === '1') {
                    content_type = "btn";
                    btn_width = 0.09;
                    btn_height = 0.09;
                }

                const myMilling01Button = createUIButton({
                    width: btn_width,
                    height: btn_height,
                    backgroundColor: background_img_src,
                    textColor: '#ffffff',
                    text: content_type,
                    fontSize: 16,
                    font: 'Arial',
                });

                myMilling01Button.position.copy(myButtonPosition);
                if (action === '1') {
                    myMilling01Button.position.z += 0.001;
                } else {
                    myMilling01Button.position.z += 0.01;
                }
                // myMilling01Button.quaternion.copy(myButtonRotation);

                addObject3DComponent(world, myMilling01ButtonEid, myMilling01Button);

                world.scene.add(myMilling01Button);
                objectsInScene.push(myMilling01Button);
            }
        }
    }

    const exited = TFCMyButtonExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const entity = exited[i];
        console.log('TFCMyButton exited', entity)

        for (let j = 0; j < objectsInScene.length; j++) {
            const object = objectsInScene[j];
            console.log("Removing object from scene: " + object.name);
            world.scene.remove(object);
        }
        objectsInScene.length = 0;
    }

    const entities = TFCMyButtonQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        if (clicked(world, entity)) {
            const scene = AFRAME.scenes[0];
            console.log("My Button clicked", entity);
            const action = APP.getString(TFCMyButton.action[entity]);
            console.log('TFCMyButton action', action);
            const content = APP.getString(TFCMyButton.content[entity])!;
            console.log('TFCMyButton content', content);
            // Get component UIRoot     
            // content likes webgl_01
            const content_type = content.split("_")[0];
            const content_number = content.split("_")[1];
            const action_string = "action_toggle_" + content_type + "_" + content_number;
            scene.emit(action_string);
            // scene.emit("action_toggle_wegbl");
        }
    }
}