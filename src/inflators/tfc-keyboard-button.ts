import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { TFCKeyboardButton, CursorRaycastable, RemoteHoverTarget, SingleActionButton } from "../bit-components";

export type TFCKeyboardButtonParams = {
    action: string;
    value: string;
};

const DEFAULTS: Required<TFCKeyboardButtonParams> = {
    action: "0",
    value: "0"
};

export function inflateTFCKeyboardButton(world: HubsWorld, eid: number, params: TFCKeyboardButtonParams) {
    console.log("inflating a KeyboardButton Component ", { eid, params });
    const requiredParams = Object.assign({}, DEFAULTS, params) as Required<TFCKeyboardButtonParams>;
    addComponent(world, TFCKeyboardButton, eid);
    TFCKeyboardButton.action[eid] = APP.getSid(requiredParams.action);
    TFCKeyboardButton.value[eid] = APP.getSid(requiredParams.value);
    addComponent(world, CursorRaycastable, eid);
    addComponent(world, RemoteHoverTarget, eid);
    addComponent(world, SingleActionButton, eid);
}