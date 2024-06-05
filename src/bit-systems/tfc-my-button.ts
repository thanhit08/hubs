import { HubsWorld } from "../app";
import {
    defineQuery, enterQuery, exitQuery, hasComponent, addComponent, addEntity
} from "bitecs";
import { Interacted, TFCMyButton, TFCNetworkedContentData } from "../bit-components";
import { createUIButton } from "../tfl-libs/myButton";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { AnimationClip, Object3D, LoopOnce, MeshBasicMaterial, Quaternion, Vector3 } from "three";
import { findAncestorWithComponent } from "../utils/scene-graph";
import { createNetworkedEntity } from "../utils/create-networked-entity";
import { takeOwnership } from "../utils/take-ownership";


const TFCMyButtonQuery = defineQuery([TFCMyButton]);
const TFCMyButtonEnterQuery = enterQuery(TFCMyButtonQuery);
const TFCMyButtonExitQuery = exitQuery(TFCMyButtonQuery);

let currentSteps = 0;
const objectsInScene: THREE.Object3D[] = [];
const listCNCButton: THREE.Object3D[] = [];
let nextStepNumber = -1;
let screenObject = new Object3D();
let isPlaying = false;
let currentTime = 0;
const startTime = 0;
const endTime = 240 / 30;

function clicked(world: HubsWorld, entity: number): boolean {
    return hasComponent(world, Interacted, entity);
}

function startStopAllAnimation(world: HubsWorld, entity: number, startOrStop: boolean): void {
    const object = world.eid2obj.get(entity);
    const mixerEl = findAncestorWithComponent(object?.parent?.parent?.el, "animation-mixer");
    const { mixer, animations } = mixerEl.components["animation-mixer"];

    animations.forEach((animation: AnimationClip) => { // Add type annotation to 'animation' parameter
        const clips = [animation];
        clips.forEach(clip => {
            const action = mixer.clipAction(clip);
            if (action) {
                if (startOrStop) {
                    if (nextStepNumber > 11) {
                        action.time = 6.6666666;
                        action.paused = false;
                    } else {
                        action.enabled = true;
                        action.setLoop(LoopOnce, 1);
                        action.clampWhenFinished = true;
                        action.play();
                        isPlaying = true;
                    }
                } else {
                    if (nextStepNumber === 11) {
                        action.paused = true;
                    } else {
                        action.enabled = false;
                        action.stop();
                        mixer.uncacheAction(action);
                    }
                }
            }
        });
    });
}

export function TFCMyButtonSystem(world: HubsWorld) {
    const myButtonEid = anyEntityWith(world, TFCMyButton);
    if (myButtonEid !== null) {
        if (isPlaying) {
            currentTime += 1;
            if (currentTime > endTime * 30) {
                currentTime = 0;
                startStopAllAnimation(world, myButtonEid, false);
                isPlaying = false;
                console.log("Animation is stopped");
                if (nextStepNumber === 11) {
                    const nextButtonEid = addEntity(world);
                    const nextButton = listCNCButton[nextStepNumber];
                    addObject3DComponent(world, nextButtonEid, nextButton);
                    world.scene.add(nextButton);
                }
            }
        }
        if (nextStepNumber === 2) {
            console.log("Enable screen");
            const screenObjectEid = addEntity(world);
            addObject3DComponent(world, screenObjectEid, screenObject);
            world.scene.add(screenObject);
        }
        const entered = TFCMyButtonEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            const entity = entered[i];
            // startStopAllAnimation(world, entity, false);
            // Get the entity's TFCMyButton component
            const action = APP.getString(TFCMyButton.action[entity]);
            console.log('TFCMyButton action', action);
            const content = APP.getString(TFCMyButton.content[entity])!;
            console.log('TFCMyButton content', content);
            const myButton = world.eid2obj.get(entity);
            const buttonChildrent = myButton?.parent?.parent?.children!;
            let buttonImage = '';
            let buttonLink = '';
            let buttonText = '';
            if (buttonChildrent.length > 2) {
                for (let i = 0; i < buttonChildrent.length; i++) {
                    const buttonChild = buttonChildrent[i];
                    console.log(buttonChild.name);
                    // check buttonChild name contains "image", "link", "text" text


                    if (buttonChild.name.includes('image')) {
                        const buttonData = buttonChild.children[0].userData;
                        // Query the data inside the buttondata 
                        // buttonData -> gltfExtension -> MOZ_hubs_components -> image
                        buttonImage = buttonData.gltfExtensions.MOZ_hubs_components.image.src;
                        // console.log('buttonImage', buttonImage);
                        TFCMyButton.buttonImage[entity] = APP.getSid(buttonImage);
                    }
                    if (buttonChild.name.includes('link')) {
                        const buttonData = buttonChild.children[0].userData;
                        // Query the data inside the buttondata
                        // buttonData -> gltfExtension -> MOZ_hubs_components -> link
                        buttonLink = buttonData.gltfExtensions.MOZ_hubs_components.link.href;
                        // console.log('buttonLink', buttonLink);
                        TFCMyButton.buttonLink[entity] = APP.getSid(buttonLink);
                    }
                    if (buttonChild.name.includes('text')) {
                        const buttonData = buttonChild.children[0].userData;
                        // Query the data inside the buttondata
                        // buttonData -> gltfExtension -> MOZ_hubs_components -> text
                        console.log(buttonData);
                        buttonText = buttonData.gltfExtensions.MOZ_hubs_components.text.value;
                        // console.log('buttonText', buttonText);
                        TFCMyButton.buttonText[entity] = APP.getSid(buttonText);
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


                // Change the material of the button
                let newMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, side: THREE.DoubleSide, transparent: true, opacity: 0.0 });
                (myButton.children[0] as THREE.Mesh).material = newMaterial;

                let content_type = content.split("_")[0];
                let background_img_src = 'https://localhost:4000/files/3c0d1ba0-d65f-4e87-a157-045bd4a40116.png'
                let btn_width = 1.6;
                let btn_height = 0.4;
                if (action === '1') {
                    content_type = "btn";
                    btn_width = 0.09;
                    btn_height = 0.09;
                    if (buttonText === '20') {
                        content_type = "screen";
                        btn_width = 0.186;
                        btn_height = 0.14;
                    }
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
                if (action === '1') {
                    if (buttonText === '0') {
                        const myMilling01ButtonEid = addEntity(world);
                        addObject3DComponent(world, myMilling01ButtonEid, myMilling01Button);
                        world.scene.add(myMilling01Button);
                    }
                } else {
                    const myMilling01ButtonEid = addEntity(world);
                    addObject3DComponent(world, myMilling01ButtonEid, myMilling01Button);
                    world.scene.add(myMilling01Button);
                }




                if (action === '1') {
                    if (buttonText === '20') {
                        screenObject = myMilling01Button;
                    } else {
                        listCNCButton.push(myMilling01Button);
                    }
                } else {
                    objectsInScene.push(myMilling01Button);
                }
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

        for (let j = 0; j < listCNCButton.length; j++) {
            const object = listCNCButton[j];
            console.log("Removing object from scene: " + object.name);
            world.scene.remove(object);
        }
        listCNCButton.length = 0;
    }

    const entities = TFCMyButtonQuery(world);
    for (let i = 0; i < entities.length; i++) {
        const entity = entities[i];
        let networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
        if (clicked(world, entity)) {
            const scene = AFRAME.scenes[0];
            console.log("My Button clicked", entity);
            const action = APP.getString(TFCMyButton.action[entity]);
            console.log('TFCMyButton action', action);
            const content = APP.getString(TFCMyButton.content[entity])!;
            console.log('TFCMyButton content', content);
            const buttonImage = APP.getString(TFCMyButton.buttonImage[entity]);
            console.log('TFCMyButton buttonImage', buttonImage);
            const buttonLink = APP.getString(TFCMyButton.buttonLink[entity])!;
            console.log('TFCMyButton buttonLink', buttonLink);
            const buttonText = APP.getString(TFCMyButton.buttonText[entity])!;
            console.log('TFCMyButton buttonText', buttonText);
            let myButton = world.eid2obj.get(entity)!;
            // Get component UIRoot     
            // content likes webgl_01
            if (action === '1') {
                const currentStep = buttonText;
                // convert currentStep to integer
                const currentStepNumber = parseInt(currentStep);
                world.scene.remove(listCNCButton[currentStepNumber]);
                myButton.visible = false;
                world.scene.remove(myButton);
                // listCNCButton.splice(currentStepNumber, 1);
                if (nextStepNumber !== -1 && nextStepNumber !== currentStepNumber) {
                    return;
                }
                nextStepNumber = currentStepNumber + 1;
                if (nextStepNumber === 11) {
                    console.log("All steps are completed");
                    startStopAllAnimation(world, entity, true);
                } else
                    if (nextStepNumber === 20) {
                        console.log("All steps are completed");
                        startStopAllAnimation(world, entity, true);
                    } else {
                        const nextButtonEid = addEntity(world);
                        const nextButton = listCNCButton[nextStepNumber];
                        addObject3DComponent(world, nextButtonEid, nextButton);
                        world.scene.add(nextButton);
                    }
                currentSteps = nextStepNumber;
                const type = "control"!;
                const steps = currentSteps.toString();
                if (networkedEid) {
                    takeOwnership(world, networkedEid);
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid("control");
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid("");
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                    TFCNetworkedContentData.clientId[networkedEid] = APP.getSid(NAF.clientId);
                } else {
                    const nid = createNetworkedEntity(world, "tfc-networked-content-data", { type: type, steps: steps, control: "", clientId: NAF.clientId });
                    networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid("control");
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid("");
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                }
            }
            if (action === '0') {
                const content_type = content.split("_")[0];
                const content_number = content.split("_")[1];
                const action_string = "action_toggle_" + content_type + "_" + content_number;
                scene.emit(action_string);
                // scene.emit("action_toggle_wegbl");
            }
        }

        if (networkedEid) {
            if (APP.getString(TFCNetworkedContentData.type[networkedEid]) != "" &&
                TFCNetworkedContentData.steps[networkedEid] !== -1) {
                if (TFCNetworkedContentData.steps[networkedEid] !== currentSteps) {
                    currentSteps = TFCNetworkedContentData.steps[networkedEid];
                    console.log("Syncing button", currentSteps);
                    // convert currentStep to integer
                    const currentStepNumber = currentSteps;
                    for (let i = 0; i < listCNCButton.length; i++) {
                        world.scene.remove(listCNCButton[i]);
                        const cncButton = world.eid2obj.get(entity)!;
                        cncButton.visible = false;
                        world.scene.remove(cncButton);
                    }
                    nextStepNumber = currentStepNumber;
                    if (nextStepNumber === 11) {
                        console.log("All steps are completed");
                        startStopAllAnimation(world, entity, true);
                    } else
                        if (nextStepNumber === 20) {
                            console.log("All steps are completed");
                            startStopAllAnimation(world, entity, true);
                        } else {
                            const nextButtonEid = addEntity(world);
                            const nextButton = listCNCButton[nextStepNumber];
                            addObject3DComponent(world, nextButtonEid, nextButton);
                            world.scene.add(nextButton);
                        }
                } else {
                }
            }
        }
    }
}