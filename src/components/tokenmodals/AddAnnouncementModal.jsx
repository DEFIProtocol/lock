import React, { useState } from "react";
import { Typography } from "antd";
import { useMoralis } from "react-moralis";
import axios from "axios";
import moment from "moment";

const { Title } = Typography;

function AnnouncementModal({ open, onClose, token, ProfilePic, render }) {
  const { Moralis } = useMoralis();
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();
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

  // creating an announcement object
  const submitAnnouncement = async () => {
    const image = photo;
    console.log(image);
    const announcement = {
      title: title,
      description: description,
      photo: image,
      date: moment().format("MM-DD-YY h:mm"),
    };
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${token}`);
    const updateToken = await query.first();
    updateToken.add("Announcements", announcement);
    updateToken.add("Pictures", image);
    if (ProfilePic == null) {
      updateToken.set("ProfilePic", image);
    }
    await updateToken.save().then(onClose);
    return updateToken.then(render());
  };

  if (!open) return null;
  return (
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
      <Title
        level={4}
        style={{ color: "#909090", float: "left", paddingTop: "10px" }}
      >
        Create Announcement
      </Title>
      <form>
        <input
          style={{
            width: "95%",
            margin: "15px auto",
            backgroundColor: "black",
            color: "lightGray",
          }}
          placeholder="Title"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          title="title"
          type="text"
        />
        <textarea
          style={{
            width: "95%",
            margin: "15px auto",
            backgroundColor: "black",
            color: "lightGray",
          }}
          placeholder="Description"
          onChange={(e) => setDescription(e.target.value)}
          value={description}
          title="announcement"
          type="textbox"
        />
        <span style={{ color: "#909090", float: "left", paddingTop: "10px" }}>
          Add Photo
        </span>
      </form>
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
      <div>
        <button
          onClick={submitAnnouncement}
          style={{
            position: "relative",
            backgroundColor: "lime",
            borderRadius: "0.5rem",
            border: "3px solid black",
          }}
        >
          Post
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
    </div>
  );
}

export default AnnouncementModal;
