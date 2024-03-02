import { Hello, Interacted } from "../bit-components";
import type { HubsWorld } from "../app";
import { defineQuery, enterQuery, exitQuery, hasComponent } from "bitecs";
import type { EntityID } from "../utils/networking-types";

const helloQuery = defineQuery([Hello]);
const helloEnterQuery = enterQuery(helloQuery);
const helloExitQuery = exitQuery(helloQuery);

function clickedHello(world: HubsWorld, eid: EntityID) {
    return hasComponent(world, Interacted, eid);
}

export function helloSystem(world: HubsWorld) {
    const entered = helloEnterQuery(world);
    for (let i = 0; i < entered.length; i++) {
        const eid = entered[i];
        console.log("Hello entered", eid);
    }

    const exited = helloExitQuery(world);
    for (let i = 0; i < exited.length; i++) {
        const eid = exited[i];
        console.log("Hello exited", eid);
    }

    helloQuery(world).forEach(eid => {
        if (clickedHello(world, eid)) {
            console.log("Hello clicked", eid);
            alert(APP.getString(Hello.message[eid]));
        }
        
    });

}