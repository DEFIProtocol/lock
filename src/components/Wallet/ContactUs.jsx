import React, { useState } from "react";
import { useMoralis } from "react-moralis";

function ContactUs({ open, onClose }) {
  const { Moralis } = useMoralis();
  const [reason, setReason] = useState();
  const [message, setMessage] = useState();
  const [email, setEmail] = useState();

  const defineIssue = async () => {
    const issues = Moralis.Object.extend("Admin");
    const issue = new issues();
    issue.set("Email", email);
    issue.set("Message", message);
    issue.set("Reason", reason);
    await issue.save().then(onClose);
  };

  if (!open) return null;
  return (
    <div style={{ display: "block" }}>
      <input
        type="email"
        placeholder="Email"
        style={{ margin: "20px" }}
        onChange={(e) => setEmail(e.target.value)}
      />
      <select
        placeholder="Reason"
        style={{ margin: "20px", marginLeft: "40px" }}
        onChange={(e) => setReason(e.target.value)}
      >
        <option value="Add functionality">
          Add Additional Information to your DAO
        </option>
        <option value="Listing DAO">List your DAO</option>
        <option value="Contract Issues">Contract Issues</option>
        <option value="Bad Actor/Dao Misrepresented">Information Issues</option>
        <option value="Other">Other</option>
      </select>
      <textarea
        placeholder="Message"
        style={{ margin: "20px", marginLeft: "40px", width: "70%" }}
        onChange={(e) => setMessage(e.target.value)}
      ></textarea>
      <button
        style={{
          margin: "20px",
          marginLeft: "40px",
          backgroundColor: "lime",
          borderRadius: "0.5rem",
          border: "3px solid black",
          display: "block",
        }}
        onClick={() => defineIssue()}
      >
        Send
      </button>
      <span onClick={onClose} style={{ color: "#909090" }}>
        Close
      </span>
    </div>
  );
}

export default ContactUs;
