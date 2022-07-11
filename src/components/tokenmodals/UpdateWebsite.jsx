import React, { useState } from "react";
import { useMoralis } from "react-moralis";

function UpdateWebsite({ address, render }) {
  const { Moralis } = useMoralis();
  const [isOpen, setIsOpen] = useState(false);
  const [website, setWebsite] = useState();

  const updateWebsite = async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Website", website);
    await updateToken.save();
    return updateToken.then(render().then(() => setIsOpen(false)));
  };

  return (
    <div>
      <button
        style={{
          backgroundColor: "lime",
          margin: "5px",
          float: "right",
          borderRadius: "0.5rem",
          border: "3px solid black",
        }}
        onClick={() => setIsOpen(true)}
      >
        Update Website
      </button>
      {!isOpen ? null : (
        <div
          style={{
            borderRadius: ".5rem",
            border: "2px black solid",
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#202020",
            padding: "50px",
            zIndex: 1000,
          }}
        >
          <span style={{ color: "#909090" }}>
            Allow investor to check out your website by providing a link here!
          </span>
          <input
            type="text"
            placeholder="Website URL"
            style={{
              width: "95%",
              margin: "15px auto",
              backgroundColor: "black",
              color: "lightGray",
            }}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <button
            style={{
              backgroundColor: "lime",
              margin: "5px",
              float: "left",
              borderRadius: "0.5rem",
              border: "3px solid black",
            }}
            type="button"
            onClick={updateWebsite}
          >
            Update
          </button>
          <button
            style={{
              backgroundColor: "lime",
              margin: "5px",
              float: "right",
              borderRadius: "0.5rem",
              border: "3px solid black",
            }}
            type="cancel"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}

export default UpdateWebsite;
