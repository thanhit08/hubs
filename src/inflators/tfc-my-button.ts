import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { TFCMyButton, CursorRaycastable, RemoteHoverTarget, SingleActionButton } from "../bit-components";

export type TFCMyButtonParams = {
    action: string;
    content: string;
};

const DEFAULTS: Required<TFCMyButtonParams> = {
    action: "0",
    content: "https://webglmulti.web.app/Milling1/"
};

export function inflateTFCMyButton(world: HubsWorld, eid: number, params: TFCMyButtonParams) {
    console.log("inflating a MyButton Component ", { eid, params });
    const requiredParams = Object.assign({}, params, DEFAULTS) as Required<TFCMyButtonParams>;
    addComponent(world, TFCMyButton, eid);
    TFCMyButton.action[eid] = APP.getSid(requiredParams.action);
    TFCMyButton.content[eid] = APP.getSid(requiredParams.content);
    addComponent(world, CursorRaycastable, eid);
    addComponent(world, RemoteHoverTarget, eid);
    addComponent(world, SingleActionButton, eid);
}