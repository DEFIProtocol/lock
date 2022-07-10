import React, { useState, useEffect } from "react";
import { useMoralisCloudFunction, useMoralis } from "react-moralis";
import { Card } from "antd";

function Admin() {
  const [isOpen, setIsOpen] = useState(false);
  const [issue, setIssue] = useState();
  const { Moralis } = useMoralis();

  const { fetch } = useMoralisCloudFunction(
    "getIssues",
    { issue: "issues" },
    { autoFetch: false },
  );

  const getIssues = async () => {
    fetch({
      onSuccess: (issues) => setIssue(issues),
      onError: (error) => console.log(error),
    });
  };
  console.log(issue);

  useEffect(() => {
    getIssues();
  }, []);

  const deleteIssue = async (message) => {
    const admin = Moralis.Object.extend("Admin");
    const query = new Moralis.Query(admin);
    query.equalTo("Message", message);
    const result = await query.first();
    if (result) {
      result.destroy().then(
        () => {
          getIssues();
        },
        (error) => {
          console.log(error);
        },
      );
    }
  };

  return (
    <div style={{ backgroundColor: "black", marginTop: "40px", width: "80%" }}>
      <h2 style={{ color: "lime" }}>Admin</h2>
      <div>
        {!issue
          ? null
          : issue.map((message, index) => (
              <div key={index}>
                <Card style={{ backgroundColor: "#909090", color: "white" }}>
                  <span style={{ display: "block", color: "black" }}>
                    {message.Email}
                  </span>
                  <span
                    style={{ display: "block", color: "black", margin: "15px" }}
                  >
                    {message.Reason}
                  </span>
                  <button
                    onClick={() => setIsOpen(true)}
                    style={{
                      backgroundColor: "lime",
                      margin: "5px",
                      float: "left",
                      borderRadius: "0.5rem",
                      border: "3px solid black",
                      color: "black",
                    }}
                  >
                    Message
                  </button>
                  {isOpen == false ? null : (
                    <span
                      style={{
                        display: "block",
                        color: "black",
                        margin: "15px",
                      }}
                    >
                      {message.Message}
                    </span>
                  )}
                  <button
                    onClick={() => deleteIssue(message.Message)}
                    style={{
                      backgroundColor: "red",
                      margin: "5px",
                      float: "left",
                      borderRadius: "0.5rem",
                      border: "3px solid black",
                      color: "black",
                    }}
                  >
                    Delete
                  </button>
                </Card>
              </div>
            ))}
      </div>
    </div>
  );
}

export default Admin;
