import React from "react";
import PropTypes from "prop-types";
import { Modal } from "../modal/Modal";
import { CloseButton } from "../input/CloseButton";
import { TextInputField } from "../input/TextInputField";
import { useForm } from "react-hook-form";
import classNames from "classnames";
import { useState } from "react";
import { Button } from "../input/Button";
import { FormattedMessage } from "react-intl";
import { Column } from "../layout/Column";
import styles from "../../assets/stylesheets/preferences-screen.scss";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as LeaveIcon } from "../icons/Leave.svg";



export function WebGLContentModal({ onClose }) {
    const { isSubmitting, handleSubmit, register, errors } = useForm({
        defaultValues: {
            contentURL: "https://webglmulti.web.app/s15Reflex",
        }
    });

    return (
        <div className={classNames(styles.preferencesPanel)} style={{ position: 'relative' }}>
            <ToolbarButton
                icon={<LeaveIcon />}
                preset={"accent2"}
                onClick={onClose}
                style={{ position: 'absolute', top: 12, left: 24 }}
            />
            <iframe
                id="inlineFrameExample"
                title="반응과 반사의 구조"
                width="100%"
                height="100%"
                src="https://webglmulti.web.app/M1" scrolling="no" style={{ frameBorder: 0 }} frameBorder="0" allow="xr-spatial-tracking">
            </iframe>

        </div>
    );
}

WebGLContentModal.propTypes = {
    onClose: PropTypes.func.isRequired
};