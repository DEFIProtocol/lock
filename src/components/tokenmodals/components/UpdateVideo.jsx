import { render } from "@testing-library/react";
import React, { useState } from "react";
import { useMoralis } from "react-moralis";

function UpdateVideo({ open, onClose, address, render }) {
  const { Moralis } = useMoralis();
  const [url, setUrl] = useState();

  // update Video

  const updateYoutubeUrl = async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.set("Video", url);
    await updateToken.save().then(onClose);
    render();
    return updateToken;
  };

  if (!open) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "#202020",
        padding: "50px",
        zIndex: 1000,
        borderRadius: ".5rem",
        border: "2px black solid",
      }}
    >
      <form>
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
          onClick={onClose}
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default UpdateVideo;
