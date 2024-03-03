import React from "react";
import { RoomLayout } from "../layout/RoomLayout";
import {
  ChatGPTMessageGroup,
  ChatGPTSidebar,
  SystemMessageGPT,
  ChatGPTMessageList,
  ChatGPTInput,
  SpawnMessageGPTButton,
  MessageGPTAttachmentButton,
  EmojiPickerGPTPopoverButton,
  PermissionMessageGPTGroup,
  SendMessageGPTButton
} from "./ChatGPTSidebar";
import imgSrc from "../../assets/background.jpg";
import videoSrc from "../../assets/video/home.mp4";
import { PermissionNotification } from "./PermissionNotifications";

export default {
  title: "Room/ChatGPTSidebar",
  parameters: {
    layout: "fullscreen"
  },
  argTypes: {
    textChatEnabled: {
      control: "boolean",
      defaultValue: true
    }
  }
};

const nextTimestamp = (function () {
  const now = Date.now();
  let time = now - 8 * 60 * 60 * 1000;
  return function nextTimeStamp() {
    time = time + (now - time) / 2.0;
    return time;
  };
})();

export const Base = args => (
  <RoomLayout
    sidebar={
      <ChatGPTSidebar>
        <ChatGPTMessageList>
          <SystemMessageGPT type="join" presence="room" name="Robert" timestamp={nextTimestamp()} />
          <SystemMessageGPT type="join" presence="room" name="Dom" timestamp={nextTimestamp()} />
          <ChatGPTMessageGroup
            sender="Dom"
            timestamp={nextTimestamp()}
            messages={[
              { type: "chat", body: "Hello!" },
              { type: "chat", body: "This is a really long message that should cause a new line." },
              { type: "image", body: { src: imgSrc } }
            ]}
          />
          <ChatGPTMessageGroup
            sent
            sender="Robert"
            timestamp={nextTimestamp()}
            messages={[
              { type: "chat", body: "Hello!" },
              { type: "chat", body: "This is a really long message that should cause a new line." },
              { type: "video", body: { src: videoSrc } },
              { type: "chat", body: "Another message" },
              { type: "chat", body: "One last message" }
            ]}
          />
          <SystemMessageGPT type="join" presence="room" name="John" timestamp={nextTimestamp()} />
          <ChatGPTMessageGroup
            sender="John"
            timestamp={nextTimestamp()}
            messages={[
              { type: "chat", body: "https://mozilla.org" },
              { type: "chat", body: "Test message with url. https://hubs.mozilla.com Best site :point_up:" },
              { type: "chat", body: ":thumbsup:" }
            ]}
          />
          <SystemMessageGPT type="join" presence="room" name="Liv" timestamp={nextTimestamp()} />
          <SystemMessageGPT type="join" presence="room" name="Robin" timestamp={nextTimestamp()} />
          <ChatGPTMessageGroup sender="Liv" timestamp={nextTimestamp()} messages={[{ type: "chat", body: ":clap:" }]} />
          <ChatGPTMessageGroup
            sender="Robin"
            timestamp={nextTimestamp()}
            messages={[{ type: "chat", body: '`console.log("Hello World")`' }]}
          />
          <ChatGPTMessageGroup
            sent
            sender="Robert"
            timestamp={nextTimestamp()}
            messages={[
              { type: "chat", body: "https://mozilla.org" },
              { type: "chat", body: "Test message with url. https://hubs.mozilla.com" }
            ]}
          />
          <PermissionMessageGPTGroup
            sent
            timestamp={nextTimestamp()}
            messages={[
              { type: "permission", body: { permission: "voice_chat", status: false } },
              { type: "permission", body: { permission: "text_chat", status: true } }
            ]}
            permissionMessage
          />
        </ChatGPTMessageList>
        {!!args.textChatEnabled && <PermissionNotification permission={"text_chat"} isMod={false} />}
        <ChatGPTInput
          afterInput={
            <>
              <EmojiPickerGPTPopoverButton onSelectEmoji={emoji => console.log(emoji)} />
              <MessageGPTAttachmentButton />
              <SendMessageGPTButton
                disabled={!args.textChatEnabled}
                title={!args.textChatEnabled ? "Text Chat Off" : undefined}
              />
              <SpawnMessageGPTButton
                disabled={!args.textChatEnabled}
                title={!args.textChatEnabled ? "Text Chat Off" : undefined}
              />
            </>
          }
          disabled={!args.textChatEnabled}
        />
      </ChatGPTSidebar>
    }
  />
);

Base.args = {
  textChatEnabled: false
};
