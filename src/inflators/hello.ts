import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { Hello, CursorRaycastable, RemoteHoverTarget, SingleActionButton } from "../bit-components";

export type HelloParams = {
    message: string;
};

const DEFAULTS: Required<HelloParams> = {
    message: 'Hello!'
};

export function inflateHello(world: HubsWorld, eid: number, params: HelloParams) {
    console.log("inflating a Hello Component ", {eid, params});
    params = Object.assign({}, params, DEFAULTS) as Required<HelloParams>;
    addComponent(world, Hello, eid);
    Hello.message[eid] = APP.getSid(params.message);

    addComponent(world, CursorRaycastable, eid);
    addComponent(world, RemoteHoverTarget, eid);
    addComponent(world, SingleActionButton, eid);
    
}