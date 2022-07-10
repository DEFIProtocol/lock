import React, { useState } from "react";
import { Typography } from "antd";
import { useMoralis } from "react-moralis";
import axios from "axios";

const { Title } = Typography;

function AddPhotos({ open, onClose, address, ProfilePic, render }) {
  const { Moralis } = useMoralis();
  const [photo, setPhoto] = useState("");

  const uploadImage = async (e) => {
    const formData = new FormData();
    const files = e.target.files;
    formData.append("file", files[0]);
    formData.append("upload_preset", "jlon6pem");
    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/gridlock/image/upload",
        formData,
      );
      console.log(response);
      const file = response;
      setPhoto(file?.data?.secure_url);
    } catch (error) {
      console.log(error);
    }
  };

  const uploadToDb = async () => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    updateToken.add("Pictures", photo);
    if (ProfilePic == null) {
      updateToken.set("ProfilePic", photo);
    }
    await updateToken.save().then(onClose);
    return updateToken.then(render());
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
      <span style={{ color: "#909090" }}>
        Upload photos for investors to see your projects progress!
      </span>
      <input
        style={{
          position: "relative",
          backgroundColor: "lime",
          borderRadius: "0.5rem",
          border: "3px solid black",
        }}
        placeholder="Upload an Image"
        onChange={uploadImage}
        name="file"
        type="file"
      />
      <button
        onClick={uploadToDb}
        style={{
          position: "relative",
          backgroundColor: "lime",
          borderRadius: "0.5rem",
          border: "3px solid black",
        }}
      >
        Upload Image
      </button>
      <button
        onClick={onClose}
        style={{
          position: "relative",
          backgroundColor: "lime",
          borderRadius: "0.5rem",
          border: "3px solid black",
        }}
      >
        Cancel
      </button>
    </div>
  );
}

export default AddPhotos;
