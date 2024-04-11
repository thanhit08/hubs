import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { PortalIDModal } from "./PortalIDModal";

export function PortalIDModalContainer({ scene, onClose }) {
    const onSubmit = useCallback(
        (destinationPortalId, portalId) => {
            // console.log(src);
            if (!destinationPortalId) return;
            if (!portalId) return;
            scene.emit("spawn-portal", { destinationPortalId, portalId });
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
