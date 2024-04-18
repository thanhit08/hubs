import { RoomLayout } from "../layout/RoomLayout";
import { AskAIModal } from "./AskAIModal";
export default {
    title: "AskAIModal",
    parameters: {
        layout: "fullscreen"
    }
};

export const Base = () => <RoomLayout modal={<AskAIModal />} />;