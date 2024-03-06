import React from "react";
import { FormattedMessage } from "react-intl";
import { joinToAnExistRoom } from "../../utils/phoenix-utils";
import { Button } from "../input/Button";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { TextInputField } from "../input/TextInputField";

export function JoinRoomButton() {
  const breakpoint = useCssBreakpoints();

  return (
    <>
      {/* Create text input field to enter room name */}
      <TextInputField
        label="Room ID"
        placeholder="Room ID"
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
          joinToAnExistRoom("akgaha", false);
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
