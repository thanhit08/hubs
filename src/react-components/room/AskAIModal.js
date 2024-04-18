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

export function AskAIModal({ onSubmit, onClose }) {
    const { isSubmitting, handleSubmit, register, errors } = useForm({
        defaultValues: {
            objectQuestion: ""
          }
    });
    const [objectQuestionState, setObjectQuestionState] = useState("");

    const onSubmitForm = (data) => {
        onSubmit(data.objectQuestion);
    }

    return (
        <Modal
            title={<FormattedMessage id="ask-ai-modal.title" defaultMessage="Ask AI" />}
            beforeTitle={<CloseButton onClick={onClose} />}
        >
            <Column as="form" padding center onSubmit={handleSubmit(onSubmitForm)}>
                <p>
                    <FormattedMessage
                        id="ask-ai-modal.message"
                        defaultMessage="Ask a question to the AI model."
                    />
                </p>
                <TextInputField
                    id="objectQuestion"
                    name="objectQuestion"
                    label={<FormattedMessage id="ask-ai-modal.question" defaultMessage="Question:" />}
                    placeholder="What is the center of gravity of a triangle?"
                    type="text"
                    onChange={(e) => setObjectQuestionState(e.target.value)}
                    required
                    {...register("objectQuestion")}
                />
                <Button type="submit" preset="accept" disabled={isSubmitting}>
                    <FormattedMessage id="ask-ai-modal.ask-ai-button" defaultMessage="Ask AI" />
                </Button>
            </Column>
        </Modal>
    );
}