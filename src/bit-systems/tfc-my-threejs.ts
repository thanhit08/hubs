import { HubsWorld } from "../app";
import { TFCMyThreeJS, Interacted, CursorRaycastable, RemoteHoverTarget, SingleActionButton, HoveredRemoteRight } from "../bit-components";
import { defineQuery, enterQuery, exitQuery, hasComponent, addEntity, addComponent } from "bitecs";
import { addObject3DComponent } from "../utils/jsx-entity";
import { anyEntityWith } from "../utils/bit-utils";
import { createNetworkedEntity } from "../utils/create-networked-entity";
import { takeOwnership } from "../utils/take-ownership";
import type { EntityID } from "../utils/networking-types";


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