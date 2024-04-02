import { HubsWorld } from "../app";
import { TFCMyThreeJS, TFCMyThreeJSButton, TFCMYThreeJSSliderBar, TFCNetworkedContentData, TFCNetworkedSyncButton } from "../bit-components";
import { Interacted, CursorRaycastable, RemoteHoverTarget, SingleActionButton, HoveredRemoteRight } from "../bit-components";
import { defineQuery, enterQuery, exitQuery, hasComponent, addEntity, addComponent } from "bitecs";
import { paths } from "../systems/userinput/paths";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { createNetworkedEntity } from "../utils/create-networked-entity";
import { takeOwnership } from "../utils/take-ownership";
import type { EntityID } from "../utils/networking-types";
import { createMyThreeJSTrans06 } from '../tfl-libs/Trans06';
import { createMyThreeJSTrans01 } from "../tfl-libs/Trans01";
import { createUIButton } from "../tfl-libs/myButton";
import { createUISlider } from "../tfl-libs/mySlider";
import { createMyThreeJSTrans07 } from "../tfl-libs/Trans07";
import { drawBox as create3DBox } from "../tfl-libs/Geo01";
import { inc } from "semver";
import { createPentagon } from "../tfl-libs/Pentagon";
import { createTrigonometry } from "../tfl-libs/Trigonometry";
import { MathUtils, Object3D, Plane, Ray, Vector3 } from "three";
import { max } from "lodash";



function clicked(world: HubsWorld, eid: EntityID) {
    return hasComponent(world, Interacted, eid);
}

const TFCMyThreeJSQuery = defineQuery([TFCMyThreeJS]);
const TFCMyThreeJSEnterQuery = enterQuery(TFCMyThreeJSQuery);
const TFCMyThreeJSExitQuery = exitQuery(TFCMyThreeJSQuery);

const TFCMyThreeJSButtonQuery = defineQuery([TFCMyThreeJSButton]);

const TFCMYThreeJSSliderBarQuery = defineQuery([TFCMYThreeJSSliderBar]);
const TFCMyThreeJSSliderBarHoveredQuery = defineQuery([HoveredRemoteRight, TFCMYThreeJSSliderBar]);
const TFCMyThreeJSSliderBarHoveredEnterQuery = enterQuery(TFCMyThreeJSSliderBarHoveredQuery);
const TFCMyThreeJSSliderBarHoveredExitQuery = exitQuery(TFCMyThreeJSSliderBarHoveredQuery);


const TFCNetworkedSyncButtonQuery = defineQuery([TFCNetworkedSyncButton]);

let networkClientId: string = "";
let category: string = "";
let unit: string = "";
let myThreeJSNextButtonEid = -1;
let myThreeJSBackButtonEid = -1;
let myThreeJSSyncButtonEid = -1;
let objectPosition = new THREE.Vector3();
let objectRotation = new THREE.Quaternion();
let objectScale = new THREE.Vector3();
let currentSteps = 36;
let myThreeJSSyncButton: THREE.Mesh;
let contentObjectRef: number = 0;
const objectsInScene: THREE.Object3D[] = [];
let increaseSteps = 1;
let myThreeJSObject = new THREE.Group();
let myThreeJSContentEid = -1;
let intersectionPoint = new THREE.Vector3();
let maxSteps = 100;
let clickedOnSlider = false;
let arraySteps = [];
const intersectInThePlaneOf = (() => {
    const plane = new Plane();
    const ray = new Ray();
    type Pose = { position: Vector3; direction: Vector3 };
    return function intersectInThePlaneOf(obj: Object3D, { position, direction }: Pose, intersection: Vector3) {
        ray.set(position, direction);
        plane.normal.set(0, 0, 1);
        plane.constant = 0;
        plane.applyMatrix4(obj.matrixWorld);
        ray.intersectPlane(plane, intersection);
    };
})();
export function TFCMyThreeJSSystem(world: HubsWorld, userinput: any) {
    const myThreeJSEid = anyEntityWith(world, TFCMyThreeJS);
    if (myThreeJSEid !== null) {

        const entered = TFCMyThreeJSEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            if (clickedOnSlider) {
                clickedOnSlider = false;
            }
            const eid = entered[i];
            console.log("My ThreeJS entered", eid);
            category = APP.getString(TFCMyThreeJS.category[eid])!;
            unit = APP.getString(TFCMyThreeJS.unit[eid])!;
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

                myThreeJSContentEid = addEntity(world);
                const myThreeJSProps = {
                    category: category,
                    unit: 6,
                    position: myThreeJSPosition,
                    rotation: myThreeJSRotation,
                    scale: myThreeJSScale,
                    steps: currentSteps
                }

                let outputSteps = 0;
                if (category === "Transformation" && unit === "1") {
                    [myThreeJSObject, outputSteps] = createMyThreeJSTrans01(myThreeJSProps);
                    maxSteps = 37;
                } else if (category === "Transformation" && unit === "6") {
                    [myThreeJSObject, outputSteps] = createMyThreeJSTrans06(myThreeJSProps);
                    maxSteps = 37;
                } else if (category === "Transformation" && unit === "7") {
                    [myThreeJSObject, outputSteps] = createMyThreeJSTrans07(myThreeJSProps);
                    maxSteps = 37;
                } else if (category === "Geometry") {
                    // convert unit to number
                    const unitNumber = parseInt(unit);
                    const myThreeJSModel3DProps = {
                        type: unitNumber,
                        angle: 0,
                        position: myThreeJSPosition,
                        rotation: myThreeJSRotation,
                        scale: myThreeJSScale
                    };
                    [myThreeJSObject, maxSteps] = create3DBox(myThreeJSModel3DProps);
                    myThreeJSObject.position.y += 2;
                    if (unit === "8") {
                        myThreeJSObject.position.y += 2;
                    }
                    currentSteps = 0;
                    increaseSteps = 5;
                } else if (category === "Pentagon") {
                    currentSteps = 0;
                    const myThreeJSModel3DProps = {
                        radius: 1,
                        position: myThreeJSPosition,
                        steps: currentSteps
                    };
                    [myThreeJSObject, outputSteps, maxSteps] = createPentagon(myThreeJSModel3DProps.radius, myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
                } else if (category === "Trigonometry") {
                    currentSteps = 0;
                    const myThreeJSModel3DProps = {
                        position: myThreeJSPosition,
                        steps: currentSteps
                    };
                    [myThreeJSObject, outputSteps, maxSteps] = createTrigonometry(myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
                }

                if (category == "Transformation" && unit == "1") {
                    myThreeJSObject.position.x += 4;
                    myThreeJSObject.position.z -= 2;
                    myThreeJSObject.rotation.z += 1.57;
                    myThreeJSObject.scale.set(0.4, 0.4, 0.4);
                }

                if (category == "Transformation" && unit == "7") {
                    myThreeJSObject.position.x += 3.5;
                    myThreeJSObject.position.z -= 2;
                    myThreeJSObject.position.y -= 1;
                    myThreeJSObject.rotation.z += 1.57;
                    myThreeJSObject.scale.set(0.4, 0.4, 0.4);
                }

                addObject3DComponent(world, myThreeJSContentEid, myThreeJSObject);
                contentObjectRef = myThreeJSContentEid;
                world.scene.add(myThreeJSObject);
                objectsInScene.push(myThreeJSObject);

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
                myThreeJSNextButton.position.x += 6;
                myThreeJSNextButton.position.y -= 1;

                addObject3DComponent(world, myThreeJSNextButtonEid, myThreeJSNextButton);
                addComponent(world, TFCMyThreeJSButton, myThreeJSNextButtonEid);
                TFCMyThreeJSButton.name[myThreeJSNextButtonEid] = APP.getSid("Next");
                TFCMyThreeJSButton.targetObjectRef[myThreeJSNextButtonEid] = myThreeJSContentEid;
                addComponent(world, RemoteHoverTarget, myThreeJSNextButtonEid);
                addComponent(world, CursorRaycastable, myThreeJSNextButtonEid);
                addComponent(world, SingleActionButton, myThreeJSNextButtonEid);
                world.scene.add(myThreeJSNextButton);
                objectsInScene.push(myThreeJSNextButton);

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
                myThreeJSBackButton.position.x += 3;
                myThreeJSBackButton.position.y -= 1;

                addObject3DComponent(world, myThreeJSBackButtonEid, myThreeJSBackButton);
                addComponent(world, TFCMyThreeJSButton, myThreeJSBackButtonEid);
                TFCMyThreeJSButton.name[myThreeJSBackButtonEid] = APP.getSid("Back");
                TFCMyThreeJSButton.targetObjectRef[myThreeJSBackButtonEid] = myThreeJSContentEid;
                addComponent(world, RemoteHoverTarget, myThreeJSBackButtonEid);
                addComponent(world, CursorRaycastable, myThreeJSBackButtonEid);
                addComponent(world, SingleActionButton, myThreeJSBackButtonEid);
                world.scene.add(myThreeJSBackButton);
                objectsInScene.push(myThreeJSBackButton);

                myThreeJSSyncButtonEid = addEntity(world);
                const syncButtonText = 'Sync ' + category + ' - ' + unit;
                myThreeJSSyncButton = createUIButton({
                    width: 2,
                    height: 1,
                    backgroundColor: '#007bff',
                    textColor: '#ffffff',
                    text: 'Sync ',
                    fontSize: 32,
                    font: 'Arial',
                });
                myThreeJSSyncButton.position.copy(myThreeJSPosition);
                myThreeJSSyncButton.position.x += 4.5;
                myThreeJSSyncButton.position.y += 1;

                addObject3DComponent(world, myThreeJSSyncButtonEid, myThreeJSSyncButton);
                addComponent(world, TFCNetworkedSyncButton, myThreeJSSyncButtonEid);
                TFCNetworkedSyncButton.type[myThreeJSSyncButtonEid] = APP.getSid("control");
                TFCNetworkedSyncButton.control[myThreeJSSyncButtonEid] = APP.getSid("control");
                TFCNetworkedSyncButton.steps[myThreeJSSyncButtonEid] = APP.getSid(currentSteps.toString());
                TFCNetworkedSyncButton.targetObjectRef[myThreeJSSyncButtonEid] = myThreeJSContentEid;
                addComponent(world, RemoteHoverTarget, myThreeJSSyncButtonEid);
                addComponent(world, CursorRaycastable, myThreeJSSyncButtonEid);
                addComponent(world, SingleActionButton, myThreeJSSyncButtonEid);
                world.scene.add(myThreeJSSyncButton);
                objectsInScene.push(myThreeJSSyncButton);

                const myThreeJSBannerButtonEid = addEntity(world);
                const bannerText = "Category: " + category + " - " + unit;
                const myThreeJSBannerButton = createUIButton({
                    width: 5,
                    height: 1,
                    backgroundColor: '#007bff',
                    textColor: '#ffffff',
                    text: bannerText,
                    fontSize: 32,
                    font: 'Arial',
                });
                myThreeJSBannerButton.position.copy(myThreeJSPosition);
                myThreeJSBannerButton.position.x += 4.5;
                myThreeJSBannerButton.position.y += 3;
                addObject3DComponent(world, myThreeJSBannerButtonEid, myThreeJSBannerButton);
                world.scene.add(myThreeJSBannerButton);
                objectsInScene.push(myThreeJSBannerButton);


                const myThreeJSProgressBarEid = addEntity(world);
                const myThreeJSProgressBar = createUISlider({
                    width: 5,
                    height: 0.5,
                    currentSteps: currentSteps,
                    minSteps: 0,
                    maxSteps: maxSteps,
                });
                myThreeJSProgressBar.position.copy(myThreeJSPosition);
                myThreeJSProgressBar.position.x += 4.5;
                console.log(myThreeJSPosition);
                // myThreeJSProgressBar.position.y += 4;
                addObject3DComponent(world, myThreeJSProgressBarEid, myThreeJSProgressBar);
                addComponent(world, TFCMYThreeJSSliderBar, myThreeJSProgressBarEid);
                TFCMYThreeJSSliderBar.name[myThreeJSProgressBarEid] = APP.getSid("SliderBar");
                TFCMYThreeJSSliderBar.targetObjectRef[myThreeJSProgressBarEid] = myThreeJSContentEid;
                addComponent(world, RemoteHoverTarget, myThreeJSProgressBarEid);
                addComponent(world, CursorRaycastable, myThreeJSProgressBarEid);
                addComponent(world, SingleActionButton, myThreeJSProgressBarEid);
                world.scene.add(myThreeJSProgressBar);
                objectsInScene.push(myThreeJSProgressBar);

            }
        }
    }

    const exited = TFCMyThreeJSExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        if (clickedOnSlider) {
            clickedOnSlider = false;
        }
        const eid = exited[i];
        console.log("My ThreeJS exited", eid);
        for (let i = 0; i < objectsInScene.length; i++) {
            console.log("Removing object from scene: " + objectsInScene[i].name);
            world.scene.remove(objectsInScene[i]);
        }
        world.scene.remove(myThreeJSObject);
        objectsInScene.length = 0;
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
        if (networkedEid) {
            if (APP.getString(TFCNetworkedContentData.type[networkedEid]) == "control") {
                if (APP.getString(TFCNetworkedContentData.clientId[networkedEid]) == NAF.clientId) {
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid("control");
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid("");
                    TFCNetworkedContentData.clientId[networkedEid] = APP.getSid("");
                }
            }
        }
    }

    const query = TFCMyThreeJSQuery(world);
    for (let i = 0; i < query.length; i++) {
        const eid = query[i];
        if (clicked(world, eid)) {
            if (clickedOnSlider) {
                clickedOnSlider = false;
            }
            console.log("My ThreeJS clicked", eid);
        }
    }

    TFCNetworkedSyncButtonQuery(world).forEach(eid => {
        if (clicked(world, eid)) {
            if (clickedOnSlider) {
                clickedOnSlider = false;
            }
            let networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;

            const type = APP.getString(TFCNetworkedSyncButton.type[eid])!;
            const steps = TFCNetworkedSyncButton.steps[eid]!;

            if (type == "control") {
                if (networkedEid) {
                    takeOwnership(world, networkedEid);
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid("control");
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid("");
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                    TFCNetworkedContentData.clientId[networkedEid] = APP.getSid(NAF.clientId);

                } else {
                    const nid = createNetworkedEntity(world, "tfc-networked-content-data", { type: type, steps: steps, control: "", clientId: NAF.clientId });
                    networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                }
            } else {
                if (networkedEid && networkClientId == NAF.clientId) {
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid(type);
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid("");
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                    TFCNetworkedContentData.clientId[networkedEid] = APP.getSid(NAF.clientId);
                }
            }
        }
    });

    TFCMYThreeJSSliderBarQuery(world).forEach(eid => {
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
        if (networkedEid) {
            if (clicked(world, eid)) {
                if (clickedOnSlider) {
                    clickedOnSlider = false;
                    return;
                }
                console.log("My ThreeJS Slider Bar clicked", eid);
                const targetObjectRef = TFCMYThreeJSSliderBar.targetObjectRef[eid];
                const targetObject = world.eid2obj.get(targetObjectRef);
                const buttonName = APP.getString(TFCMYThreeJSSliderBar.name[eid]);
                let buttonClicked = false;
                if (buttonName === "SliderBar") {
                    console.log("SliderBar clicked");
                    buttonClicked = true;
                } else {

                }
                if (buttonClicked) {
                    if (targetObject) {
                        console.log("Target Object: ", targetObject);
                        console.log('Target Position: ', objectPosition);
                        const progressBar = world.eid2obj.get(eid);

                        const { position, direction } = userinput.get(paths.actions.cursor.right.pose);
                        const plane = new Plane();
                        const ray = new Ray();
                        ray.set(position, direction);
                        plane.normal.set(0, 0, 1);
                        plane.constant = 0;
                        if (progressBar) {
                            plane.applyMatrix4(progressBar.matrixWorld);
                        }
                        // const rootPosition = new THREE.Vector3(0, 0, objectPosition.z);
                        // plane.translate(rootPosition);

                        let intersectionPoint = new Vector3();
                        ray.intersectPlane(plane, intersectionPoint);

                        if (intersectionPoint) {
                            console.log("Clicked Point: ", intersectionPoint);
                            clickedOnSlider = true;
                            // create a 3D point at the intersection point
                            // const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                            // const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                            // const sphere2 = new THREE.Mesh(geometry, material2);
                            // sphere2.position.copy(intersectionPoint);
                            // world.scene.add(sphere2);
                            // objectsInScene.push(sphere2);

                            // !!!! Calculate the slider percent (need to fix)
                            let sliderPercent = 0;
                            if (progressBar) {
                                sliderPercent = (intersectionPoint.x - (progressBar.position.x - objectPosition.x)) / 5
                            }

                            if (category === "Trigonometry") {
                                sliderPercent = (intersectionPoint.x - 4) / 5
                            }

                            if (category === "Pentagon" || category === "Transformation") {
                                sliderPercent = (intersectionPoint.x - 5) / 5
                            }

                            if (category === "Geometry") {
                                sliderPercent = (intersectionPoint.x - 4.5) / 5
                            }
                            // round the slider percent to 2 decimal places
                            const roundedSliderPercent = Math.round(sliderPercent * maxSteps);
                            console.log("Slider Percent: ", roundedSliderPercent);

                            if (progressBar) {
                                world.scene.remove(progressBar);
                            }

                            const myThreeJSProgressBarEid = addEntity(world);
                            const myThreeJSProgressBar = createUISlider({
                                width: 5,
                                height: 0.5,
                                currentSteps: roundedSliderPercent,
                                minSteps: 0,
                                maxSteps: maxSteps,
                            });
                            myThreeJSProgressBar.position.copy(objectPosition);
                            myThreeJSProgressBar.position.x += 4.5;
                            // myThreeJSProgressBar.position.y += 4;
                            addObject3DComponent(world, myThreeJSProgressBarEid, myThreeJSProgressBar);
                            addComponent(world, TFCMYThreeJSSliderBar, myThreeJSProgressBarEid);
                            TFCMYThreeJSSliderBar.name[myThreeJSProgressBarEid] = APP.getSid("SliderBar");
                            TFCMYThreeJSSliderBar.targetObjectRef[myThreeJSProgressBarEid] = myThreeJSContentEid;

                            addComponent(world, RemoteHoverTarget, myThreeJSProgressBarEid);
                            addComponent(world, CursorRaycastable, myThreeJSProgressBarEid);
                            addComponent(world, SingleActionButton, myThreeJSProgressBarEid);
                            world.scene.add(myThreeJSProgressBar);
                            objectsInScene.push(myThreeJSProgressBar);

                            if (roundedSliderPercent > currentSteps) {
                                arraySteps = [];
                                for (let i = (currentSteps + 1); i <= roundedSliderPercent; i++) {
                                    arraySteps.push(i);
                                }
                            } else {
                                arraySteps = [];
                                for (let i = (currentSteps - 1); i >= roundedSliderPercent; i--) {
                                    arraySteps.push(i);
                                }
                            }

                            currentSteps = roundedSliderPercent;
                            // world.scene.remove(targetObject);                            
                            update(myThreeJSObject, networkedEid);

                        }
                    }
                }
            }
        }
    });

    TFCMyThreeJSSliderBarHoveredQuery(world).forEach((eid: number) => {
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
        if (networkedEid) {
            if (clickedOnSlider) {
                const progressBar = world.eid2obj.get(eid);

                const { position, direction } = userinput.get(paths.actions.cursor.right.pose);
                const plane = new Plane();
                const ray = new Ray();
                ray.set(position, direction);
                plane.normal.set(0, 0, 1);
                plane.constant = 0;
                if (progressBar) {
                    plane.applyMatrix4(progressBar.matrixWorld);
                }
                // const rootPosition = new THREE.Vector3(0, 0, objectPosition.z);
                // plane.translate(rootPosition);

                let intersectionPoint = new Vector3();
                ray.intersectPlane(plane, intersectionPoint);
                console.log("Hovered Point: ", intersectionPoint);
                if (intersectionPoint) {
                    console.log("Clicked Point: ", intersectionPoint);
                    clickedOnSlider = true;
                    // create a 3D point at the intersection point
                    // const geometry = new THREE.SphereGeometry(0.1, 32, 32);
                    // const material2 = new THREE.MeshBasicMaterial({ color: 0xffff00, side: THREE.DoubleSide });
                    // const sphere2 = new THREE.Mesh(geometry, material2);
                    // sphere2.position.copy(intersectionPoint);
                    // world.scene.add(sphere2);
                    // objectsInScene.push(sphere2);

                    // !!!! Calculate the slider percent (need to fix)
                    let sliderPercent = 0;
                    if (progressBar) {
                        sliderPercent = (intersectionPoint.x - (progressBar.position.x - objectPosition.x)) / 5
                    }

                    if (category === "Trigonometry") {
                        sliderPercent = (intersectionPoint.x - 4) / 5
                    }

                    if (category === "Pentagon" || category === "Transformation") {
                        sliderPercent = (intersectionPoint.x - 5) / 5
                    }

                    if (category === "Geometry") {
                        sliderPercent = (intersectionPoint.x - 4.5) / 5
                    }
                    // round the slider percent to 2 decimal places
                    const roundedSliderPercent = Math.round(sliderPercent * maxSteps);
                    console.log("Slider Percent: ", roundedSliderPercent);

                    if (roundedSliderPercent == currentSteps) {
                        return;
                    }

                    if (progressBar) {
                        world.scene.remove(progressBar);
                    }

                    const myThreeJSProgressBarEid = addEntity(world);
                    const myThreeJSProgressBar = createUISlider({
                        width: 5,
                        height: 0.5,
                        currentSteps: roundedSliderPercent,
                        minSteps: 0,
                        maxSteps: maxSteps,
                    });
                    myThreeJSProgressBar.position.copy(objectPosition);
                    myThreeJSProgressBar.position.x += 4.5;
                    // myThreeJSProgressBar.position.y += 4;
                    addObject3DComponent(world, myThreeJSProgressBarEid, myThreeJSProgressBar);
                    addComponent(world, TFCMYThreeJSSliderBar, myThreeJSProgressBarEid);
                    TFCMYThreeJSSliderBar.name[myThreeJSProgressBarEid] = APP.getSid("SliderBar");
                    TFCMYThreeJSSliderBar.targetObjectRef[myThreeJSProgressBarEid] = myThreeJSContentEid;

                    addComponent(world, RemoteHoverTarget, myThreeJSProgressBarEid);
                    addComponent(world, CursorRaycastable, myThreeJSProgressBarEid);
                    addComponent(world, SingleActionButton, myThreeJSProgressBarEid);
                    world.scene.add(myThreeJSProgressBar);
                    objectsInScene.push(myThreeJSProgressBar);

                    if (roundedSliderPercent > currentSteps) {
                        arraySteps = [];
                        for (let i = (currentSteps + 1); i <= roundedSliderPercent; i++) {
                            arraySteps.push(i);
                        }
                    } else {
                        arraySteps = [];
                        for (let i = (currentSteps - 1); i >= roundedSliderPercent; i--) {
                            arraySteps.push(i);
                        }
                    }

                    currentSteps = roundedSliderPercent;
                    // world.scene.remove(targetObject);                            
                    update(myThreeJSObject, networkedEid);

                }
            }
        }
    });

    TFCMyThreeJSSliderBarHoveredEnterQuery(world).forEach((eid: number) => {
        // clickedOnSlider = true;
    });

    TFCMyThreeJSSliderBarHoveredExitQuery(world).forEach((eid: number) => {
        // clickedOnSlider = false;
    });

    TFCMyThreeJSButtonQuery(world).forEach(eid => {
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
        if (networkedEid) {
            if (clicked(world, eid)) {
                // disable camera rotation 
                if (clickedOnSlider) {
                    clickedOnSlider = false;
                }
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
                            currentSteps += increaseSteps;
                        } else {
                            console.log("Previous Step");
                            currentSteps -= increaseSteps;
                        }
                        update(targetObject, networkedEid);
                    }
                }
            }

            if (APP.getString(TFCNetworkedContentData.type[networkedEid]) == "control") {
                if (APP.getString(TFCNetworkedContentData.clientId[networkedEid]) == NAF.clientId) {
                    // If the current client owns the control, highlight the button.
                    (myThreeJSSyncButton.material as THREE.MeshBasicMaterial).color.setHex(0x5CB85C);
                } else {
                    // If another client owns the control, revert the button color.
                    (myThreeJSSyncButton.material as THREE.MeshBasicMaterial).color.setHex(0x000000);
                }
                networkClientId = APP.getString(TFCNetworkedContentData.clientId[networkedEid])!;
            } else {
            }

            if (APP.getString(TFCNetworkedContentData.type[networkedEid]) != "" &&
                APP.getString(TFCNetworkedContentData.steps[networkedEid]) != "") {
                if (TFCNetworkedContentData.steps[networkedEid] != currentSteps) {
                    const contentObject = world.eid2obj.get(contentObjectRef);
                    currentSteps = TFCNetworkedContentData.steps[networkedEid];
                    if (contentObject) {
                        update(contentObject, networkedEid);
                    }
                }
            }
        }
    });

    function update(targetObject: THREE.Object3D, networkedEid: number) {
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
        // let myNewThreeJSObject = new THREE.Group();
        let outputSteps = 0;
        if (category === "Transformation" && unit === "1") {
            [myThreeJSObject, outputSteps] = createMyThreeJSTrans01(myNewThreeJSProps);
        } else if (category === "Transformation" && unit === "6") {
            [myThreeJSObject, outputSteps] = createMyThreeJSTrans06(myNewThreeJSProps);
        } else if (category === "Transformation" && unit === "7") {
            [myThreeJSObject, outputSteps] = createMyThreeJSTrans07(myNewThreeJSProps);
        } else if (category === "Geometry") {
            const unitNumber = parseInt(unit);
            if (currentSteps > 90) {
                currentSteps = 90;
            }
            if (currentSteps % 5 != 0) {
                currentSteps = Math.round(currentSteps / 5) * 5;
            }
            const myThreeJSModel3DProps = {
                type: unitNumber,
                angle: currentSteps,
                position: objectPosition,
                rotation: objectRotation,
                scale: objectScale
            };
            [myThreeJSObject, maxSteps] = create3DBox(myThreeJSModel3DProps);
            myThreeJSObject.position.y += 2;
            outputSteps = currentSteps;
        } else if (category === "Pentagon") {
            if (currentSteps < 0) {
                currentSteps = 0;
            }
            if (currentSteps > 153) {
                currentSteps = 153;
            }
            const myThreeJSModel3DProps = {
                radius: 1,
                position: objectPosition,
                steps: currentSteps
            };

            [myThreeJSObject, outputSteps, maxSteps] = createPentagon(myThreeJSModel3DProps.radius, myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
        } else if (category === "Trigonometry") {
            const myThreeJSModel3DProps = {
                position: objectPosition,
                steps: currentSteps
            };
            [myThreeJSObject, outputSteps, maxSteps] = createTrigonometry(myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
        }

        if (category === "Transformation" && unit === "1") {
            myThreeJSObject.position.x += 4;
            myThreeJSObject.position.z -= 2;
            myThreeJSObject.rotation.z += 1.57;
            myThreeJSObject.scale.set(0.4, 0.4, 0.4);
        }

        if (category == "Transformation" && unit == "7") {
            myThreeJSObject.position.x += 3.5;
            myThreeJSObject.position.z -= 2;
            myThreeJSObject.position.y -= 1;
            myThreeJSObject.rotation.z += 1.57;
            myThreeJSObject.scale.set(0.4, 0.4, 0.4);
        }

        addObject3DComponent(world, myNewThreeJSContentEid, myThreeJSObject);
        contentObjectRef = myNewThreeJSContentEid;
        world.scene.add(myThreeJSObject);
        objectsInScene.push(myThreeJSObject);
        currentSteps = outputSteps;
        TFCMyThreeJSButton.targetObjectRef[myThreeJSNextButtonEid] = myNewThreeJSContentEid;
        TFCMyThreeJSButton.targetObjectRef[myThreeJSBackButtonEid] = myNewThreeJSContentEid;
        TFCNetworkedContentData.steps[networkedEid] = currentSteps;

        const myThreeJSProgressBarEid = addEntity(world);
        const myThreeJSProgressBar = createUISlider({
            width: 5,
            height: 0.5,
            currentSteps: currentSteps,
            minSteps: 0,
            maxSteps: maxSteps,
        });
        myThreeJSProgressBar.position.copy(objectPosition);
        myThreeJSProgressBar.position.x += 4.5;
        // myThreeJSProgressBar.position.y += 4;
        addObject3DComponent(world, myThreeJSProgressBarEid, myThreeJSProgressBar);
        addComponent(world, TFCMYThreeJSSliderBar, myThreeJSProgressBarEid);
        TFCMYThreeJSSliderBar.name[myThreeJSProgressBarEid] = APP.getSid("SliderBar");
        TFCMYThreeJSSliderBar.targetObjectRef[myThreeJSProgressBarEid] = myNewThreeJSContentEid;

        addComponent(world, RemoteHoverTarget, myThreeJSProgressBarEid);
        addComponent(world, CursorRaycastable, myThreeJSProgressBarEid);
        addComponent(world, SingleActionButton, myThreeJSProgressBarEid);
        world.scene.add(myThreeJSProgressBar);
        objectsInScene.push(myThreeJSProgressBar);
        myThreeJSContentEid = myNewThreeJSContentEid;

    }
}