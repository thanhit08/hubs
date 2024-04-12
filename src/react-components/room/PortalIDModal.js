import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { Column } from "../layout/Column";

export function PortalIDModal({ onSubmit, onClose }) {
    const { isSubmitting, handleSubmit, register, errors } = useForm({
        defaultValues: {
            destinationPortalId: "",
            portalId: ""
          }
    });
    const [destinationPortalIdState, setDestinationPortalIdState] = useState("");
    const [portalIdState, setportalIdState] = useState("");

    const onSubmitForm = (data) => {
        onSubmit(data.destinationPortalId, data.portalId);
    }

    return (
        <Modal
            title={<FormattedMessage id="portal-id-modal.title" defaultMessage="Create 3D object using AI" />}
            beforeTitle={<CloseButton onClick={onClose} />}
        >
            <Column as="form" padding center onSubmit={handleSubmit(onSubmitForm)}>
                <p>
                    <FormattedMessage
                        id="portal-id-modal.message"
                        defaultMessage="Enter object type and properties of the 3D model you want to embed in the scene."
                    />
                </p>
                <TextInputField
                    id="portalId"
                    name="portalId"
                    label={<FormattedMessage id="portal-id-modal.port-id" defaultMessage="Object type:" />}
                    placeholder="Box, Plane, Sphere, etc."
                    type="text"
                    onChange={(e) => setportalIdState(e.target.value)}
                    required
                    {...register("portalId")}
                />
                <TextInputField
                    id="destinationPortalId"
                    name="destinationPortalId"
                    label={<FormattedMessage id="portal-id-modal.destination-id" defaultMessage="Properties: " />}
                    placeholder="position, rotation, scale, material, etc."
                    type="text"
                    onChange={(e) => setDestinationPortalIdState(e.target.value)}
                    required
                    {...register("destinationPortalId")}
                />
                <Button type="submit" preset="accept" disabled={isSubmitting}>
                    <FormattedMessage id="portal-id-modal.spawn-portal-button" defaultMessage="Spawn Object" />
                </Button>
            </Column>
        </Modal>
    );
}

PortalIDModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};