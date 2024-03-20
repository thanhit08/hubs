import { TFCNetworkedContentData } from "../bit-components";
import { NetworkSchema } from "../utils/network-schemas";
import { defineNetworkSchema } from "../utils/define-network-schema";

const runtimeSerde = defineNetworkSchema(TFCNetworkedContentData);
export const TFCNetworkedContentDataSchema: NetworkSchema = {
  componentName: "tfc-networked-content-data",
  serialize: runtimeSerde.serialize,
  deserialize: runtimeSerde.deserialize
};
