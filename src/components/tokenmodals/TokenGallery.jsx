// fix picture index
// center photo gallery and enlarge

import React, { useEffect, useState } from "react";
import { Image } from "cloudinary-react";
import { useMoralis } from "react-moralis";
import { ForkOutlined } from "@ant-design/icons";

function TokenGallery({ open, onClose, address, pictures, render }) {
  const { isAuthenticated, user, Moralis } = useMoralis();
  const [isOpen, setIsOpen] = useState(false);
  const [slideIndex, setSlideIndex] = useState(1);
  const [userAddress, setUserAddress] = useState();
  const [updatePhotos, setUpdatePhotos] = useState("profilePic");
  const [pictureArray, setPictureArray] = useState();

  useEffect(() => {
    if (isAuthenticated) {
      setUserAddress(user.attributes.ethAddress);
      setPictureArray(pictures.slice(0).reverse());
    }
  }, [isAuthenticated, user, pictures]);

  const previous = () => {
    if (slideIndex !== 1) {
      setSlideIndex(slideIndex - 1);
    } else if (slideIndex === 1) {
      setSlideIndex(pictureArray.length);
    }
    console.log(slideIndex);
  };

  const next = () => {
    if (slideIndex !== pictureArray.length) {
      setSlideIndex(slideIndex + 1);
    } else if (slideIndex === pictureArray.length) {
      setSlideIndex(1);
    }
    console.log(slideIndex);
  };

  const save = async (photo) => {
    const tokens = Moralis.Object.extend("Tokens");
    const query = new Moralis.Query(tokens);
    query.equalTo("Address", `${address}`);
    const updateToken = await query.first();
    if (updatePhotos == "profilePic") {
      updateToken.set("ProfilePic", photo);
    } else updatePhotos == "remove";
    {
      updateToken.remove("Pictures", photo);
    }
    updateToken.save().then(() => setIsOpen(false));
    return updateToken.then(render());
  };

  if (!open) return null;
  return (
    <div
      style={{
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
      <h1 style={{ color: "#909090", align: "center" }}>DAO Gallery</h1>
      <Image
        publicId={pictureArray[slideIndex]}
        cloudName="gridlock"
        style={{
          width: "90%",
          margin: "0px auto",
        }}
      />
      {userAddress == address ? (
        <ForkOutlined
          onClick={() => setIsOpen(true)}
          style={{
            position: "absolute",
            color: "DeepSkyBlue",
            left: "49%",
            marginTop: "10px",
          }}
        />
      ) : null}
      {isOpen == true ? (
        <div
          style={{
            margin: "0px auto",
            backgroundColor: "black",
            color: "DeepSkyBlue",
            align: "center",
            borderRadius: ".5rem",
          }}
        >
          <select
            stlye={{
              background: "black",
              color: "DeepSkyBlue",
              margin: "0px auto",
              marginTop: "20px",
            }}
            onChange={(e) => setUpdatePhotos(e.target.value)}
          >
            <option
              style={{ backgroundColor: "black", color: "DeepSkyBlue" }}
              value="profilePic"
            >
              Set as Profile Picture
            </option>
            <option
              style={{ backgroundColor: "black", color: "DeepSkyBlue" }}
              value="remove"
            >
              remove
            </option>
          </select>
          <button
            style={{
              backgroundColor: "DeepSkyBlue",
              margin: "5px",
              borderRadius: "0.5rem",
              border: "3px solid black",
              color: "black",
            }}
            onClick={() => save(pictureArray[slideIndex])}
          >
            Save
          </button>
        </div>
      ) : null}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          margin: "0px auto",
          width: "90%",
          marginTop: "5px",
        }}
      >
        <button
          style={{
            backgroundColor: "DeepSkyBlue",
            margin: "5px",
            float: "left",
            borderRadius: "0.5rem",
            border: "3px solid black",
          }}
          onClick={() => previous()}
        >
          prev
        </button>
        <button
          style={{
            backgroundColor: "DeepSkyBlue",
            margin: "5px",
            float: "left",
            borderRadius: "0.5rem",
            border: "3px solid black",
          }}
          onClick={() => next()}
        >
          next
        </button>
      </div>
      <span
        onClick={onClose}
        style={{ color: "#909090", position: "absolute", left: "45%" }}
      >
        Close
      </span>
    </div>
  );
}

export default TokenGallery;
