import React, { useState } from "react";
import { useMoralis } from "react-moralis";

function AddVideo({ address, render }) {
  const { Moralis } = useMoralis();
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState(true);

  // update Video
  const updateYoutubeUrl = async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Video", url);
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
        Add Video
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
            Please enter your Youtube URL below to show investors your project!
          </span>
          <input
            type="text"
            placeholder="Youtube URL"
            style={{
              width: "95%",
              margin: "15px auto",
              backgroundColor: "black",
              color: "lightGray",
            }}
            onChange={(e) => setUrl(e.target.value)}
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
            onClick={updateYoutubeUrl}
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

export default AddVideo;
