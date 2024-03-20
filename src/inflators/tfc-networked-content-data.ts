import { addComponent } from "bitecs";
import { HubsWorld } from "../app";
import { TFCNetworkedContentData } from "../bit-components";

export type TFCNetworkedContentDataParams = {
    type: string;
    control: string;
    clientId: string;
    steps: string;
};

const DEFAULTS: Required<TFCNetworkedContentDataParams> = {
    type: "",
    control: "",
    clientId: "",
    steps: "0"
};

export function inflateTFCNetworkedContentData(world: HubsWorld, eid: number, params: TFCNetworkedContentDataParams) {
  console.log("inflating a TFC Networked Content Data Component ", {eid, params});
  params = Object.assign({}, DEFAULTS, params) as Required<TFCNetworkedContentDataParams>;
  addComponent(world, TFCNetworkedContentData, eid);
  TFCNetworkedContentData.type[eid] = APP.getSid(params.type);
  TFCNetworkedContentData.control[eid] = APP.getSid(params.control);
  TFCNetworkedContentData.clientId[eid] = APP.getSid(params.clientId);
  TFCNetworkedContentData.steps[eid] = APP.getSid(params.steps);
}
