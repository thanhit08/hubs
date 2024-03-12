import React, { useState } from "react";
import PropTypes from "prop-types";
import { TextInputField } from "./TextInputField";
import { Button } from "./Button";
import styles from "./EmailSentTextInputField.scss";
import { defineMessage, useIntl } from "react-intl";
import { fetchReticulumAuthenticated } from "../../utils/phoenix-utils";
import {caesarDecipher} from "../thanhutility";


const sendLabelMessage = defineMessage({
  id: "send-email-text-input-field.send-label",
  defaultMessage: "Send"
});

const sendingLabelMessage = defineMessage({
  id: 'send-email-text-input-field.sending-label',
  defaultMessage: 'Sending...'
});

const sentLabelMessage = defineMessage({
  id: "send-email-text-input-field.sent-label",
  defaultMessage: "Sent"
});


// Assuming your backend endpoint URL for sending emails
const EMAIL_SEND_ENDPOINT = '/api/v1/send-email';

// Define the sendEmail function
async function sendEmail(email, value, password) {
  
  const emailBody = `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                background-color: #ffffff;
                width: 90%;
                max-width: 600px;
                margin: 20px auto;
                padding: 20px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            .header {
                font-size: 24px;
                color: #333333;
                text-align: center;
            }
            .content {
                font-size: 16px;
                color: #666666;
                line-height: 1.6;
                text-align: center;
                margin-top: 20px;
            }
            .button {
                display: inline-block;
                margin: 20px auto;
                padding: 10px 20px;
                background-color: #007bff;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
            }
            .footer {
                font-size: 14px;
                color: #aaaaaa;
                text-align: center;
                margin-top: 20px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                Tekville Meta - A better way to collaborate online
            </div>
            <div class="content">
                Hello my friend, <br><br>
                Join me on Tekville Meta. I only need an hour of your time. 
                <br><br>
                <a href="${value}" class="button">Join the Room</a>
                <br><br>
                ${
                  password !== null && password.trim() !== '' 
                  ? `Room Password: <strong>${caesarDecipher(password.trim(), 3)}</strong><br><br>` 
                  : ''
                }
                Looking forward to having a productive session together!
            </div>
            <div class="footer">
                If you’re having trouble with the button above, <br> copy and paste the URL below into your web browser: <br>
                ${value}
            </div>
        </div>
    </body>
    </html>
    `;
  try {
    const emailData = {
      email: email, // Assuming the API expects a 'to' field for the recipient's email address
      subject: "Tekville Meta invitaion", // Static subject for the email
      htmlbody: emailBody, // Static body content for the email
      body: `Hello, Join me on Tekville Meta. I only need a hour of your time. Click on ${value} to join the room`, // Static body content for the email
    };
    await fetchReticulumAuthenticated("/api/v1/send-email", "POST", emailData);
  } catch (error) {
    console.error(error);
    alert('Failed to send email. Please try again.');
  }
}

export function EmailSentTextInputField({ value, password, buttonPreset, ...rest }) {
  const [email, setEmail] = useState('');
  const [sendStatus, setSendStatus] = useState('idle'); // idle, sending, sent

  const intl = useIntl();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSend = async () => {
    if (email) {
      console.log('Sending email to:', email);
      setSendStatus('sending');
      try {
        await sendEmail(email, value, password);
        setSendStatus('sent');
        setEmail('');
        alert(`Successful send invitation to ${email}`);
      } catch (error) {
        console.error(error); // It's better to handle the error more gracefully
        setSendStatus('idle');
        alert('Failed to send email. Please try again.');
      }
    }
  };

  const sendLabel = intl.formatMessage(sendLabelMessage);
  const sendingLabel = intl.formatMessage(sendingLabelMessage);
  const sentLabel = intl.formatMessage(sentLabelMessage);


  // Determine button label based on send status
  let buttonLabel;
  switch (sendStatus) {
    case 'sending':
      buttonLabel = sendingLabel;
      break;
    case 'sent':
      buttonLabel = sentLabel;
      break;
    default:
      buttonLabel = sendLabel;
  }

  return (
    <TextInputField
      label="Friend's Email"
      placeholder="Email..."
      description={
        <>
          Enter your friend's emaili. Example <a href="#">metauser@tekville.com</a>
        </>
      }
      value={email}
      onChange={handleEmailChange}
      afterInput={
        <Button
          preset={buttonPreset}
          onClick={handleSend}
          className={styles.sendButton}
          disabled={sendStatus === 'sending'}
        >
          {buttonLabel}
        </Button>
      }
      {...rest}
    />
  );
}

EmailSentTextInputField.propTypes = {
  buttonPreset: PropTypes.string
};
