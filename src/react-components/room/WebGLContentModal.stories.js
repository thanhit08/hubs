import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import { WebGLContentModal } from "./WebGLContentModal";

export default {
    title: "WebGLContentModal",
    parameters: {
        layout: "fullscreen"
    }
};

export const Base = () => <RoomLayout modal={<WebGLContentModal />} />;