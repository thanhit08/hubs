import React from "react";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub } from "../../utils/phoenix-utils";
import { Button } from "../input/Button";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { TextInputField } from "../input/TextInputField";

export function CreateRoomButton() {
  const breakpoint = useCssBreakpoints();

  return (
    <>
      <TextInputField type="password" label="Room Password" description="Must be at least 12 characters" />
      <Button
        thick={breakpoint === "sm" || breakpoint === "md"}
        xl={breakpoint !== "sm" && breakpoint !== "md"}
        preset="landing"
        onClick={e => {
          e.preventDefault();
          createAndRedirectToNewHub(null, "t7yVvtP", false);
        }}
      >
        <FormattedMessage id="create-room-button" defaultMessage="Create Room" />
      </Button>
    </>

  );
}
