import React, { useCallback } from "react";
import PropTypes from "prop-types";
import { AskAIModal } from "./AskAIModal";

let history = [];
const url = "http://localhost:5000/v1/chat/completions";

const headers = {
    "Content-Type": "application/json"
};

export function AskAIModalContainer({ scene, onClose }) {

    const onSubmit = useCallback(
        async (objectQuestion) => {
            if (!objectQuestion) return;
            alert(objectQuestion);
            history.push({ "role": "user", "content": objectQuestion });
            const data = {
                "mode": "chat",
                "character": "Example",
                "messages": history
            };

            fetch(url, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: headers
            })
                .then(response => response.json())
                .then(data => {
                    const assistantMessage = data['choices'][0]['message']['content'];
                    history.push({ "role": "assistant", "content": assistantMessage });
                    console.log(assistantMessage);
                    onClose();
                })
                .catch(error => console.error(error));
        },
        [scene, onClose]
    );

    return <AskAIModal onSubmit={onSubmit} onClose={onClose} />;
}

AskAIModalContainer.propTypes = {
    scene: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
};