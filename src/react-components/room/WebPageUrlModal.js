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

export function WebPageUrlModal({ onSubmit, onClose }) {
    const { isSubmitting, handleSubmit, register, errors } = useForm({
        defaultValues: {
            src: ""
          }
    });
    const [srcState, setSrcState] = useState("");

    const onSubmitForm = (data) => {
        // console.log(data);
        // console.log(data.src);
        onSubmit(data.src);
    }

    return (
        <Modal
            title={<FormattedMessage id="web-page-url-modal.title" defaultMessage="Web Page URL" />}
            beforeTitle={<CloseButton onClick={onClose} />}
        >
            <Column as="form" padding center onSubmit={handleSubmit(onSubmitForm)}>
                <p>
                    <FormattedMessage
                        id="web-page-url-modal.message"
                        defaultMessage="Paste a URL to the web page you want to embed in the scene."
                    />
                </p>
                <TextInputField
                    id="src"
                    name="src"
                    label={<FormattedMessage id="web-page-url-modal.url-input" defaultMessage="Web Page URL" />}
                    placeholder="https://example.com"
                    type="url"
                    onChange={(e) => setSrcState(e.target.value)}
                    required
                    {...register("src")}
                />
                <Button type="submit" preset="accept" disabled={isSubmitting}>
                    <FormattedMessage id="web-page-url-modal.spawn-web-page-button" defaultMessage="Spawn Web Page" />
                </Button>
            </Column>
        </Modal>
    );
}

WebPageUrlModal.propTypes = {
    onSubmit: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};