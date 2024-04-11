import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { PortalIDModal } from "./PortalIDModal";

export default {
    title: "PortalIDModal",
    parameters: {
        layout: "fullscreen"
    }
};

export const Base = () => <RoomLayout modal={<PortalIDModal />} />;