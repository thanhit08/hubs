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

export function WebGLContentModal({ onClose }) {
    const { isSubmitting, handleSubmit, register, errors } = useForm({
        defaultValues: {
            contentURL: "https://webglmulti.web.app/s15Reflex",
        }
    });

    return (
        <Modal
            title={<FormattedMessage id="webgl-content-modal.title" defaultMessage="반응과 반사의 구조" />}
            beforeTitle={<CloseButton onClick={onClose} width="100%" />}>
            <iframe
                id="inlineFrameExample"
                title="반응과 반사의 구조"
                width="100%"
                height="700"
                src="https://webglmulti.web.app/M1" scrolling="no" style={{ border: 0}} frameborder="0" allow="xr-spatial-tracking">
            </iframe>

        </Modal>
    );
}

WebGLContentModal.propTypes = {
    onClose: PropTypes.func.isRequired
};