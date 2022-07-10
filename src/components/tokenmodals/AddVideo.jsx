import React, { useState } from "react";
import { UpdateVideo } from "./components";

function AddVideo({ address, render }) {
  const [isOpen, setIsOpen] = useState(false);

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
        onClick={() => setIsOpen(true).then(render())}
      >
        Add Video
      </button>
      <UpdateVideo
        open={isOpen}
        onClose={() => setIsOpen(false)}
        address={address}
      />
    </div>
  );
}

export default AddVideo;
