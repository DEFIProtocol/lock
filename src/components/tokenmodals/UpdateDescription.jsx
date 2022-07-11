import React, { useState } from "react";
import { useMoralis } from "react-moralis";

function UpdateDescription({ render, address }) {
  const { Moralis } = useMoralis();
  const [isOpen, setIsOpen] = useState(false);
  const [description, setDescription] = useState();

  const updateDescription = async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Description", description);
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
        Update Description
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
            Be sure to be specific with your company description so investors
            know your companies goals and intentions!
          </span>
          <textarea
            type="textbox"
            value={description}
            placeholder="Company Description"
            style={{
              width: "95%",
              margin: "15px auto",
              backgroundColor: "black",
              color: "lightGray",
            }}
            onChange={(e) => setDescription(e.target.value)}
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
            onClick={updateDescription}
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

export default UpdateDescription;
