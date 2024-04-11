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
            title={<FormattedMessage id="portal-id-modal.title" defaultMessage="Portal ID" />}
            beforeTitle={<CloseButton onClick={onClose} />}
        >
            <Column as="form" padding center onSubmit={handleSubmit(onSubmitForm)}>
                <p>
                    <FormattedMessage
                        id="portal-id-modal.message"
                        defaultMessage="Enter this portal's ID and a destination portal's ID to the portal you want to embed in the scene."
                    />
                </p>
                <TextInputField
                    id="portalId"
                    name="portalId"
                    label={<FormattedMessage id="portal-id-modal.port-id" defaultMessage="Your Portal ID" />}
                    placeholder="portal1"
                    type="text"
                    onChange={(e) => setportalIdState(e.target.value)}
                    required
                    {...register("portalId")}
                />
                <TextInputField
                    id="destinationPortalId"
                    name="destinationPortalId"
                    label={<FormattedMessage id="portal-id-modal.destination-id" defaultMessage="Destination Portal ID" />}
                    placeholder="portal2"
                    type="text"
                    onChange={(e) => setDestinationPortalIdState(e.target.value)}
                    required
                    {...register("destinationPortalId")}
                />
                <Button type="submit" preset="accept" disabled={isSubmitting}>
                    <FormattedMessage id="portal-id-modal.spawn-portal-button" defaultMessage="Spawn Portal" />
                </Button>
            </Column>
        </Modal>
    );
}

PortalIDModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};