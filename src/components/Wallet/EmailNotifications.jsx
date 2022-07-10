import React, { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";

function EmailNotifications({ open, onClose }) {
  const { Moralis, isAuthenticated } = useMoralis();
  const [email, setEmail] = useState();
  const [newEmail, setNewEmail] = useState();
  const [setUpEmail, setSetUpEmail] = useState(false);

  const getEmail = async () => {
    if (!Moralis && !isAuthenticated) return null;
    const user = await Moralis.User.current();
    let email = user.get("email");
    setEmail(email);
  };

  useEffect(() => {
    getEmail();
  }, []);

  const updateEmail = async () => {
    if (!isAuthenticated)
      return alert("You must connect your wallet to add Email");
    try {
      const user = await Moralis.User.current();
      await user.set("email", newEmail);
      await user.save().then(getEmail().then(setSetUpEmail(false)));
    } catch (error) {
      alert("error" + error.code + error.message);
    }
  };

  if (!open) return null;
  return (
    <div>
      {!email ? (
        <div>
          <input
            style={{
              margin: "40px",
              width: "30%",
              backgroundColor: "black",
              color: "lightGray",
            }}
            placeholder="Enter Email"
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <button
            onClick={() => updateEmail()}
            style={{
              position: "relative",
              backgroundColor: "lime",
              borderRadius: "0.5rem",
              border: "3px solid black",
            }}
          >
            Set Email
          </button>
        </div>
      ) : (
        <div>
          <h4 style={{ color: "#909090", margin: "40px" }}>{email}</h4>
          <button
            onClick={() => setSetUpEmail(true)}
            style={{
              position: "relative",
              backgroundColor: "lime",
              borderRadius: "0.5rem",
              border: "3px solid black",
            }}
          >
            Update Email
          </button>
          {setUpEmail == false ? null : (
            <div>
              <input
                style={{
                  margin: "40px",
                  width: "30%",
                  backgroundColor: "black",
                  color: "lightGray",
                }}
                placeholder="Enter Email"
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <button
                onClick={() => updateEmail()}
                style={{
                  position: "relative",
                  backgroundColor: "lime",
                  borderRadius: "0.5rem",
                  border: "3px solid black",
                }}
              >
                Update Email
              </button>
            </div>
          )}
        </div>
      )}
      <span
        style={{ color: "#909090", margin: "0px auto", align: "center" }}
        onClick={onClose}
      >
        Close
      </span>
    </div>
  );
}

export default EmailNotifications;
