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

export function ExportRoomModal({ onSubmit, onClose }) {
    const { isSubmitting, handleSubmit, register, errors } = useForm({
        defaultValues: {
            roomName: "",
            roomDescription: ""
          }
    });
    const [roomNameState, setRoomNameState] = useState("");
    const [roomDescriptionState, setRoomDescriptionState] = useState("");

    const onSubmitForm = (data) => {
        onSubmit(data.roomName, data.roomDescription);
    }

    return (
        <Modal
            title={<FormattedMessage id="export-room-modal.title" defaultMessage="Export Room" />}
            beforeTitle={<CloseButton onClick={onClose} />}
        >
            <Column as="form" padding center onSubmit={handleSubmit(onSubmitForm)}>
                <p>
                    <FormattedMessage
                        id="export-room-modal.message"
                        defaultMessage="Enter the name and description of the room you want to export."
                    />
                </p>
                <TextInputField
                    id="roomName"
                    name="roomName"
                    label={<FormattedMessage id="export-room-modal.room-name" defaultMessage="Room Name:" />}
                    placeholder="Room Name"
                    type="text"
                    onChange={(e) => setRoomNameState(e.target.value)}
                    required
                    {...register("roomName")}
                />
                <TextInputField
                    id="roomDescription"
                    name="roomDescription"
                    label={<FormattedMessage id="export-room-modal.room-description" defaultMessage="Room Description: " />}
                    placeholder="Room Description"
                    type="text"
                    onChange={(e) => setRoomDescriptionState(e.target.value)}
                    required
                    {...register("roomDescription")}
                />
                <Button type="submit" preset="accept" disabled={isSubmitting}>
                    <FormattedMessage id="export-room-modal.export-room-button" defaultMessage="Export Room" />
                </Button>
            </Column>
        </Modal>
    );
}