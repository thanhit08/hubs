import React, { useState } from "react";
import { FormattedMessage } from "react-intl";
import { createAndRedirectToNewHub, createAndRedirectToNewHubWithPassword } from "../../utils/phoenix-utils";
import { Button } from "../input/Button";
import { useCssBreakpoints } from "react-use-css-breakpoints";
import { TextInputField } from "../input/TextInputField";
import { caesarCipher } from "../thanhutility";
import { width } from "@fortawesome/free-solid-svg-icons/faTimes";

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
        style={{ width: "300px" }}
        preset="landing"
        onClick={e => {
          e.preventDefault();
          createAndRedirectToNewHubWithPassword(null, "t7yVvtP", caesarCipher(password.trim(), 3), false);
        }}
      >
        <FormattedMessage id="create-room-button" defaultMessage="Create Room" />
      </Button>
      <Button
        thick={breakpoint === "sm" || breakpoint === "md"}
        xl={breakpoint !== "sm" && breakpoint !== "md"}
        style={{ width: "300px" }}
        preset="landing"
        onClick={e => {
          e.preventDefault();
          createAndRedirectToNewHubWithPassword(null, "t7yVvtP", caesarCipher(password.trim(), 3), false);
        }}
      >
        <FormattedMessage id="load-room-config-button" defaultMessage="Load Room" />
      </Button>
    </>

  );
}
