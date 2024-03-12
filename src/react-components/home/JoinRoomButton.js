import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { joinToAnExistRoom } from "../../utils/phoenix-utils";
import { Button } from "../input/Button";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { TextInputField } from "../input/TextInputField";

export function JoinRoomButton() {
  const breakpoint = useCssBreakpoints();
  const [roomID, setRoomID] = useState("");


  return (
    <>
      {/* Create text input field to enter room name */}
      <TextInputField
        label="Room ID"
        placeholder="Room ID"
        value={roomID}
        onChange={(e) => setRoomID(e.target.value)}
        description={
          <>
            Enter room ID to join <a href="#">Learn More</a>
          </>
        }
      />
      <Button
        thick={breakpoint === "sm" || breakpoint === "md"}
        xl={breakpoint !== "sm" && breakpoint !== "md"}
        preset="accent3"
        onClick={(e) => {
          e.preventDefault();
          if (roomID.trim() === "") {
            alert("Please enter room ID");
            return;
          } else {
            joinToAnExistRoom(roomID.trim(), false);
          }
        }}
      >
        <FormattedMessage
          id="join-room-button"
          defaultMessage="Join Exist Room"
        />
      </Button>
    </>
  );
}
