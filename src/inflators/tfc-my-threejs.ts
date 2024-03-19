import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { TFCMyThreeJS, CursorRaycastable, RemoteHoverTarget, SingleActionButton } from "../bit-components";

export type TFCMyThreeJSParams = {
    category: string;
    unit: string;
};

const DEFAULTS: Required<TFCMyThreeJSParams> = {
    category: "Transformation",
    unit: "1"
};

export function inflateTFCMyThreeJS(world: HubsWorld, eid: number, params: TFCMyThreeJSParams) {
    console.log("inflating a MyThreeJS Component ", {eid, params});
    const requiredParams =Object.assign({}, params, DEFAULTS) as Required<TFCMyThreeJSParams>;
    addComponent(world, TFCMyThreeJS, eid);
    TFCMyThreeJS.category[eid] = APP.getSid(requiredParams.category);
    TFCMyThreeJS.unit[eid] = APP.getSid(requiredParams.unit);
    addComponent(world, CursorRaycastable, eid);
    addComponent(world, RemoteHoverTarget, eid);
    addComponent(world, SingleActionButton, eid);
}
