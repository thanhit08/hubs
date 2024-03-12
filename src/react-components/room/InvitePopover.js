import React from "react";
import PropTypes from "prop-types";
import styles from "./InvitePopover.scss";
import { CopyableTextInputField } from "../input/CopyableTextInputField";
import { Popover } from "../popover/Popover";
import { ToolbarButton } from "../input/ToolbarButton";
import { ReactComponent as InviteIcon } from "../icons/Invite.svg";
import { Column } from "../layout/Column";
import { InviteLinkInputField } from "./InviteLinkInputField";
import { FormattedMessage, defineMessage, useIntl } from "react-intl";
import { ToolTip } from "@mozilla/lilypad-ui";
import { TextInputField } from "../input/TextInputField";
import { Button } from "../input/Button";
import { EmailSentTextInputField } from "../input/EmailSentTextInputField";

function InvitePopoverContent({ url, password, embed, inviteRequired, fetchingInvite, inviteUrl, revokeInvite }) {
  return (
    <Column center padding grow gap="lg" className={styles.invitePopover}>
      {inviteRequired ? (
        <>
          <InviteLinkInputField fetchingInvite={fetchingInvite} inviteUrl={inviteUrl} onRevokeInvite={revokeInvite} />
        </>
      ) : (
        <>
          <EmailSentTextInputField   
            value={url}  
            password={password}       
            buttonPreset="accent3"
          />
          <CopyableTextInputField
            label={<FormattedMessage id="invite-popover.room-link" defaultMessage="Room Link" />}
            value={url}
            buttonPreset="accent3"
          />
          {embed && (
            <CopyableTextInputField
              label={<FormattedMessage id="invite-popover.embed-code" defaultMessage="Embed Code" />}
              value={embed}
              buttonPreset="accent5"
            />
          )}
        </>
      )}
    </Column>
  );
}

InvitePopoverContent.propTypes = {
  url: PropTypes.string.isRequired,
  embed: PropTypes.string,
  inviteRequired: PropTypes.bool,
  fetchingInvite: PropTypes.bool,
  inviteUrl: PropTypes.string,
  revokeInvite: PropTypes.func
};

const inviteTooltipDescription = defineMessage({
  id: "invite-tooltip.description",
  defaultMessage: "Copy room link to invite others to the room"
});

const invitePopoverTitle = defineMessage({
  id: "invite-popover.title",
  defaultMessage: "Invite"
});

export function InvitePopoverButton({
  url,
  password,
  embed,
  initiallyVisible,
  popoverApiRef,
  inviteRequired,
  fetchingInvite,
  inviteUrl,
  revokeInvite,
  ...rest
}) {
  const intl = useIntl();
  const title = intl.formatMessage(invitePopoverTitle);
  const description = intl.formatMessage(inviteTooltipDescription);

  return (
    <Popover
      title={title}
      content={() => (
        <InvitePopoverContent
          url={url}
          password={password}
          embed={embed}
          inviteRequired={inviteRequired}
          fetchingInvite={fetchingInvite}
          inviteUrl={inviteUrl}
          revokeInvite={revokeInvite}
        />
      )}
      placement="top-start"
      offsetDistance={28}
      initiallyVisible={initiallyVisible}
      popoverApiRef={popoverApiRef}
    >
      {({ togglePopover, popoverVisible, triggerRef }) => (
        <ToolTip description={description}>
          <ToolbarButton
            ref={triggerRef}
            icon={<InviteIcon />}
            selected={popoverVisible}
            onClick={togglePopover}
            label={title}
            {...rest}
          />
        </ToolTip>
      )}
    </Popover>
  );
}

InvitePopoverButton.propTypes = {
  initiallyVisible: PropTypes.bool,
  popoverApiRef: PropTypes.object,
  ...InvitePopoverContent.propTypes
};
