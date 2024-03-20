/** @jsx createElementEntity */
import { createElementEntity } from "../utils/jsx-entity";

export type TFCNetworkedContentDataParams = {
    type: string;
    control: string;
    clientId: string;
    steps: string;
};

export function TFCNetworkedContentDataPrefab(params: TFCNetworkedContentDataParams) {
    return (
        <entity
            name = "TFC Networked Content Data"
            networked
            tfcNetworkedContentData={{
                type: params.type,
                control: params.control,
                clientId: params.clientId,
                steps: params.steps
            }}
        />
    );
}
