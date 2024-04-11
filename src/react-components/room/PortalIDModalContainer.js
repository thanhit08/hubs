import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { PortalIDModal } from "./PortalIDModal";

export function PortalIDModalContainer({ scene, onClose }) {
    const onSubmit = useCallback(
        (destinationPortalId) => {
            // console.log(src);
            if (!destinationPortalId) return;
            scene.emit("spawn-portal", { destinationPortalId });
            onClose();
        },
        [scene, onClose]
    );

    return <PortalIDModal onSubmit={onSubmit} onClose={onClose} />;
}

PortalIDModalContainer.propTypes = {
    scene: PropTypes.object.isRequired,
    onClose: PropTypes.func
};
