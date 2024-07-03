import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import {
  ChatGPTSidebar,
  ChatGPTMessageGroup,
  SystemMessageGPT,
  ChatGPTMessageList,
  ChatGPTInput,
  SendMessageGPTButton,
  ChatGPTLengthWarning,
  PermissionMessageGPTGroup
} from "./ChatGPTSidebar";
import { useMaintainScrollPosition } from "../misc/useMaintainScrollPosition";
import { defineMessages, useIntl } from "react-intl";
import { MAX_MESSAGE_LENGTH } from "../../utils/chat-message";
import { PermissionNotification } from "./PermissionNotifications";
import { usePermissions } from "./hooks/usePermissions";
import { useRoomPermissions } from "./hooks/useRoomPermissions";
import { useRole } from "./hooks/useRole";
import { ChatContext } from "./contexts/ChatContext";

const chatSidebarMessages = defineMessages({
  emmptyRoom: {
    id: "chat-sidebar-container.input-placeholder.empty-room",
    defaultMessage: "Nobody is here yet..."
  },
  emmptyRoomBot: {
    id: "chat-sidebar-container.input-placeholder.empty-room-bot",
    defaultMessage: "Send message to {discordChannels}"
  },
  occupants: {
    id: "chat-sidebar-container.input-placeholder.occupants",
    defaultMessage:
      "{occupantCount, plural, one {Send message to one other...} other {Send message to {occupantCount} others...} }"
  },
  occupantsAndBot: {
    id: "chat-sidebar-container.input-placeholder.occupants-and-bot",
    defaultMessage:
      "{occupantCount, plural, one {Send message to one other and {discordChannels}...} other {Send message to {occupantCount} others and {discordChannels}...} }"
  },
  textChatOff: {
    id: "chat-sidebar-container.input-send-button.disabled",
    defaultMessage: "Text Chat Off"
  }
});

// NOTE: context and related functions moved to ChatContext
export function ChatGPTSidebarContainer({
  initialValue,
  autoFocus,
  onClose
}) {
  const { messageGroups, sendMessage, setMessagesRead } = useContext(ChatContext);
  const [onScrollList, listRef, scrolledToBottom] = useMaintainScrollPosition(messageGroups);
  const [message, setMessage] = useState(initialValue || "");
  const [isCommand, setIsCommand] = useState(false);
  const { text_chat: canTextChat } = usePermissions();
  const isMod = useRole("owner");
  const { text_chat: textChatEnabled } = useRoomPermissions();
  const typingTimeoutRef = useRef();
  const intl = useIntl();
  const inputRef = useRef();

  const onKeyDown = useCallback(
    e => {
      if (!canTextChat && !isCommand) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
          sendMessage(e.target.value);
          setMessage("");
          console.log("Send message");
        }
      } else if (e.key === "Escape") {
        onClose();
      }
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = setTimeout(() => window.APP.hubChannel.endTyping(), 500);
      window.APP.hubChannel.beginTyping();
    },
    [sendMessage, setMessage, onClose, canTextChat, isCommand]
  );

  const onSendMessage = useCallback(() => {
    sendMessage(message.substring(0, MAX_MESSAGE_LENGTH));
    setMessage("");
  }, [message, sendMessage, setMessage]);

  useEffect(() => {
    if (autoFocus) {
      inputRef.current.focus();
      const len = inputRef.current.value.length;
      inputRef.current.setSelectionRange(len, len);
    }
  }, []);

  useEffect(() => {
    if (scrolledToBottom) {
      setMessagesRead();
    }
  }, [messageGroups, scrolledToBottom, setMessagesRead]);

  let placeholder;
  placeholder = intl.formatMessage(chatSidebarMessages["emmptyRoom"]);

  const isMobile = AFRAME.utils.device.isMobile();
  const isOverMaxLength = message.length > MAX_MESSAGE_LENGTH;
  const isDisabled = message.length === 0 || isOverMaxLength || !canTextChat;
  return (
    <ChatGPTSidebar onClose={onClose}>
      <ChatGPTMessageList ref={listRef} onScroll={onScrollList}>
        {messageGroups.map(entry => {
          const { id, systemMessage, type } = entry;
          if (systemMessage) {
            return <SystemMessageGPT key={id} {...entry} />;
          } else {
            if (type === "permission") {
              return <PermissionMessageGPTGroup key={id} {...entry} />;
            } else {
              return <ChatGPTMessageGroup key={id} {...entry} />;
            }
          }
        })}
      </ChatGPTMessageList>
      {!canTextChat && <PermissionNotification permission={"text_chat"} />}
      {!textChatEnabled && isMod && <PermissionNotification permission={"text_chat"} isMod={true} />}
      <ChatGPTInput
        id="chat-input"
        ref={inputRef}
        onKeyDown={onKeyDown}
        onChange={e => setMessage(e.target.value)}
        placeholder={placeholder}
        value={message}
        isOverMaxLength={isOverMaxLength}
        warning={
          <>
            {message.length + 50 > MAX_MESSAGE_LENGTH && (
              <ChatGPTLengthWarning messageLength={message.length} maxLength={MAX_MESSAGE_LENGTH} />
            )}
          </>
        }
        afterInput={
          <>
            <SendMessageGPTButton
              onClick={onSendMessage}
              as={"button"}
              disabled={isDisabled && !isCommand}
              title={isDisabled && !isCommand ? intl.formatMessage(chatSidebarMessages["textChatOff"]) : undefined}
            />
          </>
        }
      />
    </ChatGPTSidebar>
  );
}

ChatGPTSidebarContainer.propTypes = {
  onClose: PropTypes.func.isRequired,
  autoFocus: PropTypes.bool,
  initialValue: PropTypes.string
};
