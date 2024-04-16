import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { ExportRoomModal } from "./ExportRoomModal";

export default {
    title: "ExportRoomModal",
    parameters: {
        layout: "fullscreen"
    }
};

export const Base = () => <RoomLayout modal={<ExportRoomModal />} />;