import { HubsWorld } from "../app";
import { TFCMyThreeJS, Interacted, CursorRaycastable, RemoteHoverTarget, SingleActionButton, HoveredRemoteRight } from "../bit-components";
import { defineQuery, enterQuery, exitQuery, hasComponent, addEntity, addComponent } from "bitecs";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { createNetworkedEntity } from "../utils/create-networked-entity";
import { takeOwnership } from "../utils/take-ownership";
import type { EntityID } from "../utils/networking-types";
import {createMyThreeJS} from '../tfl-libs/myThreeJS';


function clicked(world: HubsWorld, eid: EntityID) {
    return hasComponent(world, Interacted, eid);
}

const TFCMyThreeJSQuery = defineQuery([TFCMyThreeJS]);
const TFCMyThreeJSEnterQuery = enterQuery(TFCMyThreeJSQuery);
const TFCMyThreeJSExitQuery = exitQuery(TFCMyThreeJSQuery);

let networkClientId: string = "";
let category: string = "";
let unit: string = "";

export function TFCMyThreeJSSystem(world: HubsWorld) {
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
            const myThreeJSRotation = new THREE.Quaternion();
            myThreeJS.getWorldQuaternion(myThreeJSRotation);
            const myThreeJSScale = new THREE.Vector3();
            myThreeJS.getWorldScale(myThreeJSScale);
            myThreeJS.visible = false;

            const myThreeJSEid = addEntity(world);
            const myThreeJSProps = {
                category: category,
                unit: unit,
                position: myThreeJSPosition,
                rotation: myThreeJSRotation,
                scale: myThreeJSScale
            }
            let myThreeJSObject = createMyThreeJS(myThreeJSProps);
            addObject3DComponent(world, myThreeJSEid, myThreeJSObject);
            addComponent(world, RemoteHoverTarget, myThreeJSEid);
            addComponent(world, CursorRaycastable, myThreeJSEid);
            addComponent(world, SingleActionButton, myThreeJSEid);
                        
            world.scene.add(myThreeJSObject);
        }
    }

    const exited = TFCMyThreeJSExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const eid = exited[i];
        console.log("My ThreeJS exited", eid);
    }

    TFCMyThreeJSQuery(world).forEach(eid => {
        if (clicked(world, eid)) {
            console.log("My ThreeJS clicked", eid);
        }
    });
}