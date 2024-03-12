import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub, createAndRedirectToNewHubWithPassword } from "../../utils/phoenix-utils";
import { Button } from "../input/Button";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { TextInputField } from "../input/TextInputField";

export function CreateRoomButton() {
  const breakpoint = useCssBreakpoints();
  const [password, setPassword] = useState("");

  return (
    <>
      <TextInputField
        type="password"
        label="Room Password"
        description="Must be at least 12 characters"
        value={password}
        onChange={e => setPassword(e.target.value)}
      />
      <Button
        thick={breakpoint === "sm" || breakpoint === "md"}
        xl={breakpoint !== "sm" && breakpoint !== "md"}
        preset="landing"
        onClick={e => {
          e.preventDefault();
          createAndRedirectToNewHubWithPassword(null, "t7yVvtP", password, false);
        }}
      >
        <FormattedMessage id="create-room-button" defaultMessage="Create Room" />
      </Button>
    </>

  );
}
