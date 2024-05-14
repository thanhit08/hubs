import { HubsWorld } from "../app";
import { defineQuery, enterQuery, exitQuery, hasComponent, Not, entityExists, addComponent, addEntity } from "bitecs";
import { Interacted, TFCMyButton } from "../bit-components";
import { createUIButton } from "../tfl-libs/myButton";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { AnimationClip } from "three";
import { findAncestorWithComponent } from "../utils/scene-graph";

const TFCMyButtonQuery = defineQuery([TFCMyButton]);
const TFCMyButtonEnterQuery = enterQuery(TFCMyButtonQuery);
const TFCMyButtonExitQuery = exitQuery(TFCMyButtonQuery);

const objectsInScene: THREE.Object3D[] = [];
const listCNCButton: THREE.Object3D[] = [];
const getActiveClips = (
    animations: Array<AnimationClip>,
    activeClipIndices: number[],
    clip: string
): AnimationClip[] => {
    if (clip !== "") {
        const activeClips = [];
        const clipNames = clip.split(",");
        for (let i = 0; i < clipNames.length; i++) {
            const clipName = clipNames[i];
            const foundClip = animations.find((clip: AnimationClip) => {
                return clip.name === clipName;
            });
            if (foundClip) {
                activeClips.push(foundClip);
            } else {
                console.warn(`Could not find animation names '${clipName}' in `, animations);
            }
        }
        return activeClips;
    } else {
        return activeClipIndices.map((index: number) => animations[index]);
    }
};
function clicked(world: HubsWorld, entity: number) {
    return hasComponent(world, Interacted, entity);
}

function startStopAllAnimation(world: HubsWorld, entity: number, startOrStop: boolean) {
    const object = world.eid2obj.get(entity);
    const mixerEl = findAncestorWithComponent(object?.parent?.parent?.el, "animation-mixer");
    const { mixer, animations } = mixerEl.components["animation-mixer"];
    if (animations.length > 0) {
        for (let i = 0; i < animations.length; i++) {
            const clips = [animations[i]];
            console.log('clips', clips);
            for (let j = 0; j < clips.length; j++) {
                const clip = clips[j];
                if (!clip) {
                } else {
                    const action = mixer.clipAction(clip);
                    if (action) {
                        if (startOrStop) {
                            action.enabled = true;
                            action.play();
                            console.log("Starting action", action);
                        } else {
                            action.enabled = false;
                            action.stop();
                            console.log("Stopping action", action);
                            if (mixer !== null) {
                                mixer.uncacheAction(action);
                            }
                        }
                    }
                }
            }
        }
    }
}

export function TFCMyButtonSystem(world: HubsWorld) {
    const myButtonEid = anyEntityWith(world, TFCMyButton);
    if (myButtonEid !== null) {

        const entered = TFCMyButtonEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~');
            const entity = entered[i];
            startStopAllAnimation(world, entity, false);
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
                    listCNCButton.push(myMilling01Button);
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
                // listCNCButton.splice(currentStepNumber, 1);
                const nextStepNumber = currentStepNumber + 1;
                if (nextStepNumber === listCNCButton.length) {
                    console.log("All steps are completed");
                    startStopAllAnimation(world, entity, true);
                } else {
                    const nextButtonEid = addEntity(world);
                    const nextButton = listCNCButton[nextStepNumber];
                    addObject3DComponent(world, nextButtonEid, nextButton);
                    world.scene.add(nextButton);
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
    }
}