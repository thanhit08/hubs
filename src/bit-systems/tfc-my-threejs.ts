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
import { createConstruction01 } from "../tfl-libs/Construction01";
import { MathUtils, Object3D, Plane, Ray, Vector3 } from "three";
import { max } from "lodash";
import { ThreeMFLoader } from "three-stdlib";



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
let myThreeJSProgressBar = new THREE.Mesh();
let myThreeJSContentEid = -1;
let intersectionPoint = new THREE.Vector3();
let maxSteps = 100;
let clickedOnSlider = false;
let arraySteps = [];
const progressBarWidth = 5;
let sliderPadding = 4;
/**
 * Executes the TFCMyThreeJSSystem.
 * 
 * @param world - The HubsWorld object.
 * @param userinput - The user input.
 */
export function TFCMyThreeJSSystem(world: HubsWorld, userinput: any) {
    const myThreeJSEid = anyEntityWith(world, TFCMyThreeJS);
    if (myThreeJSEid !== null) {

        const entered = TFCMyThreeJSEnterQuery(world);
        for (let i = 0; i < entered.length; i++) {
            if (clickedOnSlider) {
                clickedOnSlider = false;
            }
            const eid = entered[i];
            console.log("My ThreeJS entered", eid); // Print the entered entity ID for debugging purposes
            category = APP.getString(TFCMyThreeJS.category[eid])!; // Get the category value from the entity and assign it to the 'category' variable
            unit = APP.getString(TFCMyThreeJS.unit[eid])!; // Get the unit value from the entity and assign it to the 'unit' variable
            console.log("Category: ", category); // Print the category value for debugging purposes
            console.log("Unit: ", unit); // Print the unit value for debugging purposes
            const myThreeJS = world.eid2obj.get(eid); // Get the myThreeJS object from the world using the entity ID
            // if myThreeJS is not a networked entity, create a networked entity        
            if (myThreeJS) {
                // create a position, rotation, and scale component
                // then copy the position, rotation, and scale from myThreeJS to the components
                // Get the world position of myThreeJS object
                const myThreeJSPosition = new THREE.Vector3();
                myThreeJS.getWorldPosition(myThreeJSPosition);
                objectPosition = myThreeJSPosition;

                // Get the world rotation of myThreeJS object
                const myThreeJSRotation = new THREE.Quaternion();
                myThreeJS.getWorldQuaternion(myThreeJSRotation);
                objectRotation = myThreeJSRotation;

                // Get the world scale of myThreeJS object
                const myThreeJSScale = new THREE.Vector3();
                myThreeJS.getWorldScale(myThreeJSScale);
                objectScale = myThreeJSScale;

                // Hide the myThreeJS object
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

                // create content object based on category and unit
                let outputSteps = 0;
                if (category === "Transformation") {
                    switch (unit) {
                        case "1":
                            [myThreeJSObject, outputSteps] = createMyThreeJSTrans01(myThreeJSProps);
                            myThreeJSObject.position.x += 4;
                            myThreeJSObject.position.z -= 2;
                            myThreeJSObject.rotation.z += 1.57;
                            myThreeJSObject.scale.set(0.4, 0.4, 0.4);
                            break;
                        case "6":
                            [myThreeJSObject, outputSteps] = createMyThreeJSTrans06(myThreeJSProps);
                            break;
                        case "7":
                            [myThreeJSObject, outputSteps] = createMyThreeJSTrans07(myThreeJSProps);
                            myThreeJSObject.position.x += 3.5;
                            myThreeJSObject.position.z -= 2;
                            myThreeJSObject.position.y -= 1;
                            myThreeJSObject.rotation.z += 1.57;
                            myThreeJSObject.scale.set(0.4, 0.4, 0.4);
                            break;
                    }
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
                    [myThreeJSObject, maxSteps] = create3DBox(myThreeJSModel3DProps); // Create a 3D box object
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
                    // Create a pentagon object
                    [myThreeJSObject, outputSteps, maxSteps] = createPentagon(myThreeJSModel3DProps.radius, myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
                } else if (category === "Trigonometry") {
                    currentSteps = 0;
                    const myThreeJSModel3DProps = {
                        position: myThreeJSPosition,
                        steps: currentSteps
                    };
                    // Create a trigonometry object
                    [myThreeJSObject, outputSteps, maxSteps] = createTrigonometry(myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
                } else if (category === "Construction") {
                    sliderPadding = 0;
                    currentSteps = 0;
                    const myThreeJSModel3DProps = {
                        position: myThreeJSPosition,
                        steps: currentSteps
                    };
                    // Create a construction object
                    [myThreeJSObject, outputSteps, maxSteps] = createConstruction01(myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
                }

                // Add the content object to the world
                addObject3DComponent(world, myThreeJSContentEid, myThreeJSObject);
                contentObjectRef = myThreeJSContentEid; // Set the content object reference
                world.scene.add(myThreeJSObject); // Add the content object to the scene 
                objectsInScene.push(myThreeJSObject); // Add the content object to the objects in scene array

                // Create a next button
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
                // Set the position of the next button
                myThreeJSNextButton.position.copy(myThreeJSPosition);
                myThreeJSNextButton.position.x += 6;
                myThreeJSNextButton.position.y -= 1;

                // Add the next button to the world
                addObject3DComponent(world, myThreeJSNextButtonEid, myThreeJSNextButton);
                // Add the TFCMyThreeJSButton component to the next button entity
                addComponent(world, TFCMyThreeJSButton, myThreeJSNextButtonEid);
                // Set the name of the next button entity
                TFCMyThreeJSButton.name[myThreeJSNextButtonEid] = APP.getSid("Next");
                // Set the target object reference of the next button entity
                TFCMyThreeJSButton.targetObjectRef[myThreeJSNextButtonEid] = myThreeJSContentEid;
                // Add the RemoteHoverTarget component to the next button entity
                addComponent(world, RemoteHoverTarget, myThreeJSNextButtonEid);
                // Add the CursorRaycastable component to the next button entity
                addComponent(world, CursorRaycastable, myThreeJSNextButtonEid);
                // Add the SingleActionButton component to the next button entity
                addComponent(world, SingleActionButton, myThreeJSNextButtonEid);
                // Add the next button to the scene
                world.scene.add(myThreeJSNextButton);
                // Add the next button to the objects in scene array
                objectsInScene.push(myThreeJSNextButton);

                // Create a back button
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
                // Set the position of the back button
                myThreeJSBackButton.position.copy(myThreeJSPosition);
                myThreeJSBackButton.position.x += 3;
                myThreeJSBackButton.position.y -= 1;

                // Add the back button to the world
                addObject3DComponent(world, myThreeJSBackButtonEid, myThreeJSBackButton);

                // Add the TFCMyThreeJSButton component to the back button entity
                addComponent(world, TFCMyThreeJSButton, myThreeJSBackButtonEid);

                // Set the name of the back button entity
                TFCMyThreeJSButton.name[myThreeJSBackButtonEid] = APP.getSid("Back");

                // Set the target object reference of the back button entity
                TFCMyThreeJSButton.targetObjectRef[myThreeJSBackButtonEid] = myThreeJSContentEid;

                // Add the RemoteHoverTarget component to the back button entity
                addComponent(world, RemoteHoverTarget, myThreeJSBackButtonEid);

                // Add the CursorRaycastable component to the back button entity
                addComponent(world, CursorRaycastable, myThreeJSBackButtonEid);

                // Add the SingleActionButton component to the back button entity
                addComponent(world, SingleActionButton, myThreeJSBackButtonEid);

                // Add the back button to the scene
                world.scene.add(myThreeJSBackButton);

                // Add the back button to the objects in scene array
                objectsInScene.push(myThreeJSBackButton);

                // Create a sync button
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
                // Set the position of the sync button
                myThreeJSSyncButton.position.copy(myThreeJSPosition);
                myThreeJSSyncButton.position.x += 4.5;
                myThreeJSSyncButton.position.y += 1;

                // Add the sync button to the world
                addObject3DComponent(world, myThreeJSSyncButtonEid, myThreeJSSyncButton);
                // Add the TFCNetworkedSyncButton component to the sync button entity
                addComponent(world, TFCNetworkedSyncButton, myThreeJSSyncButtonEid);
                // Set the type of the sync button entity
                TFCNetworkedSyncButton.type[myThreeJSSyncButtonEid] = APP.getSid("control");
                // Set the control of the sync button entity
                TFCNetworkedSyncButton.control[myThreeJSSyncButtonEid] = APP.getSid("control");
                // Set the steps of the sync button entity
                TFCNetworkedSyncButton.steps[myThreeJSSyncButtonEid] = APP.getSid(currentSteps.toString());
                // Set the target object reference of the sync button entity
                TFCNetworkedSyncButton.targetObjectRef[myThreeJSSyncButtonEid] = myThreeJSContentEid;
                // Add the RemoteHoverTarget component to the sync button entity
                addComponent(world, RemoteHoverTarget, myThreeJSSyncButtonEid);
                // Add the CursorRaycastable component to the sync button entity
                addComponent(world, CursorRaycastable, myThreeJSSyncButtonEid);
                // Add the SingleActionButton component to the sync button entity
                addComponent(world, SingleActionButton, myThreeJSSyncButtonEid);
                // Add the sync button to the scene
                world.scene.add(myThreeJSSyncButton);
                // Add the sync button to the objects in scene array
                objectsInScene.push(myThreeJSSyncButton);

                // Create a banner button
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
                // Set the position of the banner button
                myThreeJSBannerButton.position.copy(myThreeJSPosition);
                myThreeJSBannerButton.position.x += 4.5;
                myThreeJSBannerButton.position.y += 3;

                // Add the banner button to the world
                addObject3DComponent(world, myThreeJSBannerButtonEid, myThreeJSBannerButton);

                // Add the banner button to the scene
                world.scene.add(myThreeJSBannerButton);

                // Add the banner button to the objects in scene array
                objectsInScene.push(myThreeJSBannerButton);

                // Create a progress bar
                const myThreeJSProgressBarEid = addEntity(world);
                myThreeJSProgressBar = createUISlider({
                    width: progressBarWidth,
                    height: 0.5,
                    currentSteps: currentSteps,
                    minSteps: -(sliderPadding / 2),
                    maxSteps: (maxSteps + sliderPadding / 2),
                });
                // Set the position of the progress bar
                myThreeJSProgressBar.position.copy(myThreeJSPosition);
                myThreeJSProgressBar.position.x += 4.5;

                // Add the progress bar object to the world
                addObject3DComponent(world, myThreeJSProgressBarEid, myThreeJSProgressBar);
                // Add the TFCMYThreeJSSliderBar component to the progress bar entity
                addComponent(world, TFCMYThreeJSSliderBar, myThreeJSProgressBarEid);
                // Set the name of the progress bar entity
                TFCMYThreeJSSliderBar.name[myThreeJSProgressBarEid] = APP.getSid("SliderBar");
                // Set the target object reference of the progress bar entity
                TFCMYThreeJSSliderBar.targetObjectRef[myThreeJSProgressBarEid] = myThreeJSContentEid;
                // Add the RemoteHoverTarget component to the progress bar entity
                addComponent(world, RemoteHoverTarget, myThreeJSProgressBarEid);
                // Add the CursorRaycastable component to the progress bar entity
                addComponent(world, CursorRaycastable, myThreeJSProgressBarEid);
                // Add the SingleActionButton component to the progress bar entity
                addComponent(world, SingleActionButton, myThreeJSProgressBarEid);
                // Add the progress bar to the scene
                world.scene.add(myThreeJSProgressBar);
                // Add the progress bar to the objects in scene array
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
        console.log("My ThreeJS exited", eid); // Print the exited entity ID for debugging purposes
        for (let i = 0; i < objectsInScene.length; i++) {
            console.log("Removing object from scene: " + objectsInScene[i].name); // Print the name of the object being removed from the scene
            world.scene.remove(objectsInScene[i]); // Remove the object from the scene
        }
        world.scene.remove(myThreeJSObject); // Remove the myThreeJSObject from the scene
        objectsInScene.length = 0; // Clear the objectsInScene array
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!; // Get the networked entity ID
        if (networkedEid) {
            if (APP.getString(TFCNetworkedContentData.type[networkedEid]) == "control") {
                if (APP.getString(TFCNetworkedContentData.clientId[networkedEid]) == NAF.clientId) {
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid("control"); // Set the type of the networked entity to "control"
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid(""); // Clear the control value of the networked entity
                    TFCNetworkedContentData.clientId[networkedEid] = APP.getSid(""); // Clear the clientId value of the networked entity
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

    // Iterate over each TFCNetworkedSyncButton entity in the world
    TFCNetworkedSyncButtonQuery(world).forEach(eid => {
        // Check if the button is clicked
        if (clicked(world, eid)) {
            // Reset clickedOnSlider flag if it was set
            if (clickedOnSlider) {
                clickedOnSlider = false;
            }
            // Get the networked entity ID associated with the button
            let networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;

            // Get the type and steps values from the TFCNetworkedSyncButton entity
            const type = APP.getString(TFCNetworkedSyncButton.type[eid])!;
            const steps = TFCNetworkedSyncButton.steps[eid]!;

            // Check the type of the button
            if (type == "control") {
                // If it's a control button, update the networked entity data
                if (networkedEid) {
                    // Take ownership of the networked entity
                    takeOwnership(world, networkedEid);
                    // Set the type, control, steps, and clientId values of the networked entity
                    TFCNetworkedContentData.type[networkedEid] = APP.getSid("control");
                    TFCNetworkedContentData.control[networkedEid] = APP.getSid("");
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                    TFCNetworkedContentData.clientId[networkedEid] = APP.getSid(NAF.clientId);

                } else {
                    // If the networked entity doesn't exist, create a new one
                    const nid = createNetworkedEntity(world, "tfc-networked-content-data", { type: type, steps: steps, control: "", clientId: NAF.clientId });
                    networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
                    TFCNetworkedContentData.steps[networkedEid] = currentSteps;
                }
            } else {
                // If it's not a control button, update the networked entity data only if the client ID matches
                if (networkedEid && networkClientId == NAF.clientId) {
                    // Set the type, control, steps, and clientId values of the networked entity
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
                console.log("My ThreeJS Slider Bar clicked", eid); // Print the ID of the clicked slider bar for debugging purposes
                const targetObjectRef = TFCMYThreeJSSliderBar.targetObjectRef[eid]; // Get the reference to the target object associated with the slider bar
                const targetObject = world.eid2obj.get(targetObjectRef); // Get the actual target object from the reference
                const buttonName = APP.getString(TFCMYThreeJSSliderBar.name[eid]); // Get the name of the slider bar button
                let buttonClicked = false; // Initialize a flag to track if the button is clicked
                if (buttonName === "SliderBar") { // Check if the button name is "SliderBar"
                    console.log("SliderBar clicked"); // Print a message indicating that the slider bar is clicked
                    buttonClicked = true; // Set the buttonClicked flag to true
                } else {
                    // Handle other button types if needed
                }
                // Check if the button is clicked
                if (buttonClicked) {
                    // Get the position and direction of the cursor
                    if (targetObject) {
                        const progressBar = world.eid2obj.get(eid); // Get the progress bar object using the entity ID

                        const { position, direction } = userinput.get(paths.actions.cursor.right.pose); // Get the position and direction of the cursor
                        const plane = new Plane(); // Create a new plane object
                        const ray = new Ray(); // Create a new ray object
                        ray.set(position, direction); // Set the position and direction of the ray
                        plane.normal.set(0, 0, 1); // Set the normal of the plane to (0, 0, 1)
                        plane.constant = 0; // Set the constant of the plane to 0
                        if (progressBar) {
                            plane.applyMatrix4(progressBar.matrixWorld); // Apply the world matrix of the progress bar to the plane
                        }

                        let intersectionPoint = new Vector3(); // Create a new vector to store the intersection point
                        ray.intersectPlane(plane, intersectionPoint); // Calculate the intersection point between the ray and the plane

                        // Check if the intersection point is valid
                        if (intersectionPoint) {
                            // Set clickedOnSlider flag to true
                            clickedOnSlider = true;
                            // Calculate the slider percent based on the intersection point
                            let sliderPercent = 0;
                            if (progressBar) {
                                sliderPercent = (intersectionPoint.x - (progressBar.position.x - progressBarWidth / 2)) / 5;
                            }
                            // Round the slider percent to 2 decimal places
                            const roundedSliderPercent = Math.round(sliderPercent * (maxSteps + sliderPadding)) - sliderPadding / 2;

                            // Remove the progress bar from the scene if it exists
                            if (progressBar) {
                                world.scene.remove(progressBar);
                            }

                            // Update the current steps value
                            currentSteps = roundedSliderPercent;
                            // Update the target object
                            update(myThreeJSObject, networkedEid);

                        }
                    }
                }
            }
        }
    });

    // Handle the case when the cursor hovers over the slider bar
    TFCMyThreeJSSliderBarHoveredQuery(world).forEach((eid: number) => {
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!; // Get the networked entity ID
        // Check if the networked entity exists
        if (networkedEid) {
            // Check if the slider bar is clicked
            if (clickedOnSlider) {
                // Set clickedOnSlider flag to false
                const progressBar = world.eid2obj.get(eid);

                // Get the position and direction of the cursor from user input
                const { position, direction } = userinput.get(paths.actions.cursor.right.pose);

                // Create a plane and a ray for intersection calculation
                const plane = new Plane();
                const ray = new Ray();
                ray.set(position, direction);

                // Set the normal and constant values of the plane
                plane.normal.set(0, 0, 1);
                plane.constant = 0;

                // Apply the world matrix of the progressBar to the plane
                if (progressBar) {
                    plane.applyMatrix4(progressBar.matrixWorld);
                }

                // Calculate the intersection point between the ray and the plane
                let intersectionPoint = new Vector3();
                ray.intersectPlane(plane, intersectionPoint);

                // Check if the intersection point is valid
                if (intersectionPoint) {
                    // Set clickedOnSlider flag to true
                    clickedOnSlider = true;

                    let sliderPercent = 0;
                    if (progressBar) {
                        // Calculate the percentage of the slider based on the intersection point
                        sliderPercent = (intersectionPoint.x - (progressBar.position.x - progressBarWidth / 2)) / 5
                    }
                    // Round the slider percentage to 2 decimal places
                    const roundedSliderPercent = Math.round(sliderPercent * (maxSteps + sliderPadding)) - sliderPadding / 2;

                    // Check if the rounded slider percentage is equal to the current steps
                    if (roundedSliderPercent == currentSteps) {
                        return; // Exit the function if the slider percentage hasn't changed
                    }

                    if (progressBar) {
                        world.scene.remove(progressBar); // Remove the old progress bar from the scene
                    }

                    // Update the currentSteps variable with the roundedSliderPercent value
                    currentSteps = roundedSliderPercent;
                    // Call the update function with the myThreeJSObject and networkedEid parameters
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

    // Iterate over each TFCMyThreeJSButton entity in the world
    TFCMyThreeJSButtonQuery(world).forEach(eid => {
        // Check if the button is clicked
        const networkedEid = anyEntityWith(world, TFCNetworkedContentData)!;
        // Check if the networked entity exists
        if (networkedEid) {
            // Check if the button is clicked
            if (clicked(world, eid)) {
                // disable camera rotation 
                if (clickedOnSlider) {
                    clickedOnSlider = false; // Reset the clickedOnSlider flag
                }
                console.log("My ThreeJS Button clicked", eid); // Print the ID of the clicked button for debugging purposes
                const targetObjectRef = TFCMyThreeJSButton.targetObjectRef[eid]; // Get the reference to the target object associated with the button
                const targetObject = world.eid2obj.get(targetObjectRef); // Get the target object from the world using the reference
                const buttonName = APP.getString(TFCMyThreeJSButton.name[eid]); // Get the name of the clicked button
                let nextStep = true; // Initialize the nextStep flag to true
                let buttonClicked = false; // Initialize the buttonClicked flag to false
                if (buttonName === "Next") { // Check if the clicked button is the "Next" button
                    console.log("Next button clicked"); // Print a message indicating that the "Next" button was clicked
                    nextStep = true; // Set the nextStep flag to true
                    buttonClicked = true; // Set the buttonClicked flag to true
                } else if (buttonName === "Back") { // Check if the clicked button is the "Back" button
                    console.log("Back button clicked"); // Print a message indicating that the "Back" button was clicked
                    nextStep = false; // Set the nextStep flag to false
                    buttonClicked = true; // Set the buttonClicked flag to true
                }

                if (buttonClicked) {
                    if (targetObject) {
                        console.log("Current Steps: ", currentSteps); // Print the current steps for debugging purposes
                        if (nextStep) {
                            console.log("Next Step"); // Print a message indicating that the next step is being performed
                            currentSteps += increaseSteps; // Increment the current steps by the increase steps value
                        } else {
                            console.log("Previous Step"); // Print a message indicating that the previous step is being performed
                            currentSteps -= increaseSteps; // Decrement the current steps by the increase steps value
                        }
                        update(targetObject, networkedEid); // Update the target object with the new current steps value
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
                // Add any additional logic here for handling non-control types
            }

            // Check if the networked entity has a valid type and steps value
            if (APP.getString(TFCNetworkedContentData.type[networkedEid]) != "" &&
                APP.getString(TFCNetworkedContentData.steps[networkedEid]) != "") {
                // Check if the steps value of the networked entity is different from the currentSteps value
                if (TFCNetworkedContentData.steps[networkedEid] != currentSteps) {
                    const contentObject = world.eid2obj.get(contentObjectRef);
                    // Update the currentSteps value with the steps value of the networked entity
                    currentSteps = TFCNetworkedContentData.steps[networkedEid];
                    if (contentObject) {
                        // Update the contentObject with the new currentSteps value
                        update(contentObject, networkedEid);
                    }
                }
            }
        }
    });

    function update(targetObject: THREE.Object3D, networkedEid: number) {
        if (currentSteps < 0) {
            currentSteps = 0; // Ensure currentSteps is not negative
        }
        if (currentSteps > maxSteps) {
            currentSteps = maxSteps; // Ensure currentSteps is not greater than maxSteps
        }
        // Check if the target object exists
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
        // Create a new ThreeJS object based on the category and unit values
        const myNewThreeJSContentEid = addEntity(world);
        // Create a new ThreeJS object based on the category and unit values
        let outputSteps = 0;
        // Create a new ThreeJS object based on the category and unit values
        if (category === "Transformation") {
            switch (unit) {
                case "1":
                    [myThreeJSObject, outputSteps] = createMyThreeJSTrans01(myNewThreeJSProps);
                    myThreeJSObject.position.x += 4;
                    myThreeJSObject.position.z -= 2;
                    myThreeJSObject.rotation.z += 1.57;
                    myThreeJSObject.scale.set(0.4, 0.4, 0.4);
                    break;
                case "6":
                    [myThreeJSObject, outputSteps] = createMyThreeJSTrans06(myNewThreeJSProps);
                    break;
                case "7":
                    [myThreeJSObject, outputSteps] = createMyThreeJSTrans07(myNewThreeJSProps);
                    myThreeJSObject.position.x += 3.5;
                    myThreeJSObject.position.z -= 2;
                    myThreeJSObject.position.y -= 1;
                    myThreeJSObject.rotation.z += 1.57;
                    myThreeJSObject.scale.set(0.4, 0.4, 0.4);
                    break;
            }
        } else if (category === "Geometry") {
            const unitNumber = parseInt(unit); // Convert the 'unit' variable to an integer
            if (currentSteps > 90) { // Check if 'currentSteps' is greater than 90
                currentSteps = 90; // Set 'currentSteps' to 90
            }
            if (currentSteps % 5 != 0) { // Check if 'currentSteps' is not divisible by 5
                currentSteps = Math.round(currentSteps / 5) * 5; // Round 'currentSteps' to the nearest multiple of 5
            }
            const myThreeJSModel3DProps = {
                type: unitNumber,
                angle: currentSteps,
                position: objectPosition,
                rotation: objectRotation,
                scale: objectScale
            };
            // Create a 3D box object based on the myThreeJSModel3DProps
            [myThreeJSObject, maxSteps] = create3DBox(myThreeJSModel3DProps);
            // Adjust the position of the myThreeJSObject
            myThreeJSObject.position.y += 2;
            // Set the outputSteps to the currentSteps
            outputSteps = currentSteps;
        } else if (category === "Pentagon") {
            if (currentSteps < 0) {
                currentSteps = 0; // Ensure currentSteps is not negative
            }
            if (currentSteps > 153) {
                currentSteps = 153; // Ensure currentSteps is not greater than 153
            }
            const myThreeJSModel3DProps = {
                radius: 1,
                position: objectPosition,
                steps: currentSteps
            };

            [myThreeJSObject, outputSteps, maxSteps] = createPentagon(myThreeJSModel3DProps.radius, myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps); // Create a pentagon object based on the myThreeJSModel3DProps
        } else if (category === "Trigonometry") {
            // Define the properties for the myThreeJSModel3DProps object
            const myThreeJSModel3DProps = {
                position: objectPosition, // Set the position property to the objectPosition variable
                steps: currentSteps // Set the steps property to the currentSteps variable
            };
            // Call the createTrigonometry function with the myThreeJSModel3DProps as arguments
            // Assign the returned values to myThreeJSObject, outputSteps, and maxSteps variables
            [myThreeJSObject, outputSteps, maxSteps] = createTrigonometry(myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
        } else if (category === "Construction") {
            const myThreeJSModel3DProps = {
                position: objectPosition,
                steps: currentSteps
            };
            // Create a construction object
            [myThreeJSObject, outputSteps, maxSteps] = createConstruction01(myThreeJSModel3DProps.position, myThreeJSModel3DProps.steps);
        }

        // Add the myThreeJSObject to the world as an Object3D component
        addObject3DComponent(world, myNewThreeJSContentEid, myThreeJSObject);
        // Set the contentObjectRef to the myNewThreeJSContentEid
        contentObjectRef = myNewThreeJSContentEid;
        // Add the myThreeJSObject to the scene
        world.scene.add(myThreeJSObject);
        // Add the myThreeJSObject to the objectsInScene array
        objectsInScene.push(myThreeJSObject);
        // Update the currentSteps value
        currentSteps = outputSteps;
        // Set the targetObjectRef of the myThreeJSNextButtonEid and myThreeJSBackButtonEid to the myNewThreeJSContentEid
        TFCMyThreeJSButton.targetObjectRef[myThreeJSNextButtonEid] = myNewThreeJSContentEid;
        TFCMyThreeJSButton.targetObjectRef[myThreeJSBackButtonEid] = myNewThreeJSContentEid;
        // Update the steps value of the networked entity
        TFCNetworkedContentData.steps[networkedEid] = currentSteps;

        world.scene.remove(myThreeJSProgressBar); // Remove the progress bar from the scene
        // Create a new entity for the myThreeJSProgressBar
        const myThreeJSProgressBarEid = addEntity(world);

        // Create a UI slider for the progress bar
        myThreeJSProgressBar = createUISlider({
            width: progressBarWidth,
            height: 0.5,
            currentSteps: currentSteps,
            minSteps: -(sliderPadding / 2),
            maxSteps: (maxSteps + sliderPadding / 2),
        });

        // Set the position of the progress bar
        myThreeJSProgressBar.position.copy(objectPosition);
        myThreeJSProgressBar.position.x += 4.5;

        // Add the Object3D component to the progress bar entity
        addObject3DComponent(world, myThreeJSProgressBarEid, myThreeJSProgressBar);

        // Add the TFCMYThreeJSSliderBar component to the progress bar entity
        addComponent(world, TFCMYThreeJSSliderBar, myThreeJSProgressBarEid);

        // Set the name and targetObjectRef properties of the TFCMYThreeJSSliderBar component
        TFCMYThreeJSSliderBar.name[myThreeJSProgressBarEid] = APP.getSid("SliderBar");
        TFCMYThreeJSSliderBar.targetObjectRef[myThreeJSProgressBarEid] = myNewThreeJSContentEid;

        // Add additional components to the progress bar entity
        addComponent(world, RemoteHoverTarget, myThreeJSProgressBarEid);
        addComponent(world, CursorRaycastable, myThreeJSProgressBarEid);
        addComponent(world, SingleActionButton, myThreeJSProgressBarEid);

        // Add the progress bar to the scene and objectsInScene array
        world.scene.add(myThreeJSProgressBar);
        objectsInScene.push(myThreeJSProgressBar);

        // Update the myThreeJSContentEid with the new entity ID
        myThreeJSContentEid = myNewThreeJSContentEid;

    }
}