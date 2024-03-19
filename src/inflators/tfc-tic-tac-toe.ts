import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { TFCTicTacToe, CursorRaycastable, RemoteHoverTarget, SingleActionButton  } from "../bit-components";

export type TFCTicTacToeParams = {
    source: string;
};


const DEFAULTS: Required<TFCTicTacToeParams> = {
    source: "pvp"
};

export function inflateTFCTicTacToe(world: HubsWorld, eid: number, params: TFCTicTacToeParams) {
    console.log("inflating a Tic Tac Toe Component ", {eid, params});
    const requiredParams =Object.assign({}, params, DEFAULTS) as Required<TFCTicTacToeParams>;
    addComponent(world, TFCTicTacToe, eid);
    TFCTicTacToe.source[eid] = APP.getSid(requiredParams.source);  
    addComponent(world, CursorRaycastable, eid);
    addComponent(world, RemoteHoverTarget, eid);
    addComponent(world, SingleActionButton, eid);
    
}