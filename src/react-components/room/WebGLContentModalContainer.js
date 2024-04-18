import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { WebGLContentModal } from "./WebGLContentModal";

export function WebGLContentModalContainer({ scene, onClose }) {
    return <WebGLContentModal onClose={onClose} />;
}

WebGLContentModalContainer.propTypes = {
    scene: PropTypes.object.isRequired,
    onClose: PropTypes.func
};
