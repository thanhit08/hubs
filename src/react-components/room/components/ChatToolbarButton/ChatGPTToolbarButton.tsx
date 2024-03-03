import { ToolbarButton } from "../../../input/ToolbarButton";

import { ReactComponent as ChatGPTIcon } from "../../../icons/ChatGPT.svg";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import React, { useContext } from "react";
import { ChatContext } from "../../contexts/ChatContext";
import { ToolTip } from "@mozilla/lilypad-ui";

const chatGPTTooltipDescription = defineMessage({
  id: "chat-tooltip.description",
  defaultMessage: "Open the chat GPT sidebar (T)"
});

type ChatGPTToolbarButtonProps = {
  onClick: () => void;
  selected: boolean
};

const ChatGPTToolbarButton = ({ onClick, selected }: ChatGPTToolbarButtonProps) => {
    const { unreadMessages } = useContext(ChatContext);
    const intl = useIntl();
    const description = intl.formatMessage(chatGPTTooltipDescription);
    
    return (
        <ToolTip description={description}>
        <ToolbarButton
            // Ignore type lint error as we will be redoing ToolbarButton in the future
            // @ts-ignore
            onClick={onClick}
            statusColor={unreadMessages ? "unread" : undefined}
            icon={<ChatGPTIcon />}
            preset="accent4"
            label={<FormattedMessage id="chat-gpt-toolbar-button" defaultMessage="ChatGPT" />}
            selected={selected}
        />
        </ToolTip>
    );
    }

export default ChatGPTToolbarButton;