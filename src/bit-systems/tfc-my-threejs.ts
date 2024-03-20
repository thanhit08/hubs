import { HubsWorld } from "../app";
import { TFCMyThreeJS, TFCMyThreeJSButton, TFCNetworkedContentData } from "../bit-components";
import { Interacted, CursorRaycastable, RemoteHoverTarget, SingleActionButton, HoveredRemoteRight } from "../bit-components";
import { defineQuery, enterQuery, exitQuery, hasComponent, addEntity, addComponent } from "bitecs";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { createNetworkedEntity } from "../utils/create-networked-entity";
import { takeOwnership } from "../utils/take-ownership";
import type { EntityID } from "../utils/networking-types";
import { createMyThreeJS } from '../tfl-libs/myThreeJS';
import { createUIButton } from "../tfl-libs/myButton";


function clicked(world: HubsWorld, eid: EntityID) {
    return hasComponent(world, Interacted, eid);
}

const TFCMyThreeJSQuery = defineQuery([TFCMyThreeJS]);
const TFCMyThreeJSEnterQuery = enterQuery(TFCMyThreeJSQuery);
const TFCMyThreeJSExitQuery = exitQuery(TFCMyThreeJSQuery);

const TFCMyThreeJSButtonQuery = defineQuery([TFCMyThreeJSButton]);

let networkClientId: string = "";
let category: string = "";
let unit: string = "";
let myThreeJSNextButtonEid = -1;
let myThreeJSBackButtonEid = -1;
let objectPosition = new THREE.Vector3();
let objectRotation = new THREE.Quaternion();
let objectScale = new THREE.Vector3();
let currentSteps = 10;

export function TFCMyThreeJSSystem(world: HubsWorld) {
    const myThreeJSEid = anyEntityWith(world, TFCMyThreeJS);
    if (myThreeJSEid !== null) {

        const entered = TFCMyThreeJSEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            const eid = entered[i];
            console.log("My ThreeJS entered", eid);
            const category = APP.getString(TFCMyThreeJS.category[eid]);
            const unit = APP.getString(TFCMyThreeJS.unit[eid]);
            console.log("Category: ", category);
            console.log("Unit: ", unit);
            const myThreeJS = world.eid2obj.get(eid);
            // if myThreeJS is not a networked entity, create a networked entity        
            if (myThreeJS) {
                // create a position, rotation, and scale component
                // then copy the position, rotation, and scale from myThreeJS to the components
                const myThreeJSPosition = new THREE.Vector3();
                myThreeJS.getWorldPosition(myThreeJSPosition);
                objectPosition = myThreeJSPosition;
                const myThreeJSRotation = new THREE.Quaternion();
                myThreeJS.getWorldQuaternion(myThreeJSRotation);
                objectRotation = myThreeJSRotation;
                const myThreeJSScale = new THREE.Vector3();
                myThreeJS.getWorldScale(myThreeJSScale);
                objectScale = myThreeJSScale;
                myThreeJS.visible = false;

                const myThreeJSContentEid = addEntity(world);
                const myThreeJSProps = {
                    category: category,
                    unit: unit,
                    position: myThreeJSPosition,
                    rotation: myThreeJSRotation,
                    scale: myThreeJSScale,
                    steps: currentSteps
                }
                const [myThreeJSObject, outputSteps] = createMyThreeJS(myThreeJSProps);
                addObject3DComponent(world, myThreeJSContentEid, myThreeJSObject);
                world.scene.add(myThreeJSObject);


                myThreeJSNextButtonEid = addEntity(world);
                const myThreeJSNextButton = createUIButton({
                    width: 2,
                    height: 1,
                    backgroundColor: '#007bff',
                    textColor: '#ffffff',
                    text: 'Next',
                    fontSize: 32,
                    font: 'Arial',
                });
                myThreeJSNextButton.position.copy(myThreeJSPosition);
                myThreeJSNextButton.position.x += 5;

                addObject3DComponent(world, myThreeJSNextButtonEid, myThreeJSNextButton);
                addComponent(world, TFCMyThreeJSButton, myThreeJSNextButtonEid);
                TFCMyThreeJSButton.name[myThreeJSNextButtonEid] = APP.getSid("Next");
                TFCMyThreeJSButton.targetObjectRef[myThreeJSNextButtonEid] = myThreeJSContentEid;
                addComponent(world, RemoteHoverTarget, myThreeJSNextButtonEid);
                addComponent(world, CursorRaycastable, myThreeJSNextButtonEid);
                addComponent(world, SingleActionButton, myThreeJSNextButtonEid);
                world.scene.add(myThreeJSNextButton);

                myThreeJSBackButtonEid = addEntity(world);
                const myThreeJSBackButton = createUIButton({
                    width: 2,
                    height: 1,
                    backgroundColor: '#007bff',
                    textColor: '#ffffff',
                    text: 'Back',
                    fontSize: 32,
                    font: 'Arial',
                });
                myThreeJSBackButton.position.copy(myThreeJSPosition);
                myThreeJSBackButton.position.x += 2;

                addObject3DComponent(world, myThreeJSBackButtonEid, myThreeJSBackButton);
                addComponent(world, TFCMyThreeJSButton, myThreeJSBackButtonEid);
                TFCMyThreeJSButton.name[myThreeJSBackButtonEid] = APP.getSid("Back");
                TFCMyThreeJSButton.targetObjectRef[myThreeJSBackButtonEid] = myThreeJSContentEid;
                addComponent(world, RemoteHoverTarget, myThreeJSBackButtonEid);
                addComponent(world, CursorRaycastable, myThreeJSBackButtonEid);
                addComponent(world, SingleActionButton, myThreeJSBackButtonEid);
                world.scene.add(myThreeJSBackButton);


            }
        }
    }

    const exited = TFCMyThreeJSExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const eid = exited[i];
        console.log("My ThreeJS exited", eid);
    }

    const query = TFCMyThreeJSQuery(world);
    for (let i = 0; i < query.length; i++) {
        const eid = query[i];
        if (clicked(world, eid)) {
            console.log("My ThreeJS clicked", eid);
        }
    }
    // TFCMyThreeJSQuery(world).forEach(eid => {
    //     const networkedEid = anyEntityWith(world, TFCNetworkedContentData);
    //     if(networkedEid) {
    //         networkClientId = APP.getString(TFCNetworkedContentData.clientId[networkedEid]);
    //         currentSteps = parseInt(APP.getString(TFCNetworkedContentData.steps[networkedEid]));
    //     }
    // });

    TFCMyThreeJSButtonQuery(world).forEach(eid => {
        if (clicked(world, eid)) {
            console.log("My ThreeJS Button clicked", eid);
            const targetObjectRef = TFCMyThreeJSButton.targetObjectRef[eid];
            const targetObject = world.eid2obj.get(targetObjectRef);
            const buttonName = APP.getString(TFCMyThreeJSButton.name[eid]);
            let nextStep = true;
            let buttonClicked = false;
            if (buttonName === "Next") {
                console.log("Next button clicked");
                nextStep = true;
                buttonClicked = true;
            } else if (buttonName === "Back") {
                console.log("Back button clicked");
                nextStep = false;
                buttonClicked = true;
            }

            if (buttonClicked) {
                if (targetObject) {
                    console.log("Target Object: ", targetObject);
                    console.log("Current Steps: ", currentSteps);
                    if (nextStep) {
                        console.log("Next Step");
                        currentSteps += 1;
                    } else {
                        console.log("Previous Step");
                        currentSteps -= 1;
                    }

                    console.log("After click -> Steps: ", currentSteps);
                    
                    world.scene.remove(targetObject);
                    // create a new object
                    const myNewThreeJSProps = {
                        category: category,
                        unit: unit,
                        position: objectPosition,
                        rotation: objectRotation,
                        scale: objectScale,
                        steps: currentSteps
                    }
                    const myNewThreeJSContentEid = addEntity(world);
                    // let myNewThreeJSObject = new THREE.Group();
                    // let outputSteps = 0;
                    const [myNewThreeJSObject, outputSteps] = createMyThreeJS(myNewThreeJSProps);
                    addObject3DComponent(world, myNewThreeJSContentEid, myNewThreeJSObject);
                    world.scene.add(myNewThreeJSObject);
                    currentSteps = outputSteps;
                    TFCMyThreeJSButton.targetObjectRef[myThreeJSNextButtonEid] = myNewThreeJSContentEid;
                    TFCMyThreeJSButton.targetObjectRef[myThreeJSBackButtonEid] = myNewThreeJSContentEid;

                }

            }



        }
    });
}