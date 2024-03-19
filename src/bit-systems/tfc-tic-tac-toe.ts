import type {HubsWorld} from "../app";
import {defineQuery, enterQuery, exitQuery, hasComponent, addEntity, addComponent} from "bitecs";
import {TFCTicTacToe} from "../bit-components";
import { addObject3DComponent } from "../utils/jsx-entity";
import type { EntityID } from "../utils/networking-types";
import { anyEntityWith } from "../utils/bit-utils";
import { createNetworkedEntity } from "../utils/create-networked-entity";
import { takeOwnership } from "../utils/take-ownership";
import { Interacted, CursorRaycastable, RemoteHoverTarget, SingleActionButton,  HoveredRemoteRight} from "../bit-components";

function clicked(world: HubsWorld, eid: EntityID) {
    return hasComponent(world, Interacted, eid);
}

const TFCTicTacToeQuery = defineQuery([TFCTicTacToe]);
const TFCTicTacToeEnterQuery = enterQuery(TFCTicTacToeQuery);
const TFCTicTacToeExitQuery = exitQuery(TFCTicTacToeQuery);

let networkClientId: string = "";
let gameMode: string = "";

let gameBoard: THREE.Group;

export function TFCTicTacToeSystem(world: HubsWorld) {
    const entered = TFCTicTacToeEnterQuery(world);
    for (let i = 0; i < entered.length; i++) {
        const eid = entered[i];
        console.log("Tic Tac Toe entered", eid);
    }
}
