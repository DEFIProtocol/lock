import TransferAssets from "./TransferAssets";
import EmailNotifications from "./EmailNotifications";
import React, { useState } from "react";
import ContactUs from "./ContactUs";

function Wallet() {
  const [isOpen, setIsOpen] = useState(false);
  const [emailIsOpen, setEmailIsOpen] = useState(false);
  const [contactUs, setContactUs] = useState(false);

  return (
    <div style={{ width: "100%", marginTop: "40px", display: "block" }}>
      <div style={{ marginBottom: "40px", width: "100%" }}>
        <h4
          style={{
            color: "#909090",
            borderBottom: "3px solid #909090",
            width: "90%",
          }}
        >
          Transfer Assets
        </h4>
        <button
          style={{
            backgroundColor: "lime",
            margin: "10px",
            float: "left",
            borderRadius: "0.5rem",
            border: "3px solid black",
          }}
          onClick={() => setIsOpen(true)}
        >
          Transfer
        </button>
        <TransferAssets open={isOpen} onClose={() => setIsOpen(false)} />
      </div>

      <div
        style={{ marginTop: "40px", position: "relative", display: "block" }}
      >
        <h4
          style={{
            color: "#909090",
            borderBottom: "3px solid #909090",
            width: "90%",
          }}
        >
          Email Notifications
        </h4>
        <button
          onClick={() => setEmailIsOpen(true)}
          style={{
            backgroundColor: "lime",
            margin: "10px",
            float: "left",
            borderRadius: "0.5rem",
            border: "3px solid black",
          }}
        >
          Setup
        </button>
        <EmailNotifications
          open={emailIsOpen}
          onClose={() => setEmailIsOpen(false)}
        />
      </div>

      <div
        style={{
          marginTop: "40px",
          position: "relative",
          width: "100%",
          display: "block",
        }}
      >
        <h4
          style={{
            color: "#909090",
            borderBottom: "3px solid #909090",
            width: "90%",
          }}
        >
          Contact Us
        </h4>
        <button
          onClick={() => setContactUs(true)}
          style={{
            backgroundColor: "lime",
            margin: "10px",
            float: "left",
            borderRadius: "0.5rem",
            border: "3px solid black",
          }}
        >
          Contact
        </button>
        <ContactUs open={contactUs} onClose={() => setContactUs(false)} />
      </div>

      <div
        style={{
          marginTop: "40px",
          position: "relative",
          width: "100%",
          display: "block",
        }}
      >
        <h4
          style={{
            color: "#909090",
            borderBottom: "3px solid #909090",
            width: "90%",
          }}
        >
          Transactions
        </h4>
      </div>
    </div>
  );
}

export default Wallet;
