import React from "react";
import { Image } from "cloudinary-react";

function Announcements({ announcements, name }) {
  if (!announcements) return null;
  return (
    <div style={{ marginTop: "30px" }}>
      {announcements
        .slice(0)
        .reverse()
        .map((announcement, index) => (
          <div
            key={index}
            style={{
              marginTop: "30px",
              backgroundColor: "#101010",
              borderRadius: ".5rem",
            }}
          >
            <Image
              cloudName="gridlock"
              publicId={announcement.photo}
              style={{
                width: "100%",
                align: "center",
                margin: "0px auto",
                borderRadius: ".5rem",
              }}
            />
            <div style={{ width: "90%", margin: "0px auto" }}>
              <h3
                style={{
                  color: "#909090",
                  textAlign: "left",
                  display: "block",
                }}
              >
                {announcement.title}
              </h3>
            </div>
            <div style={{ width: "90%", margin: "0px auto" }}>
              <h5
                style={{ color: "#909090", float: "right", display: "block" }}
              >
                {announcement.date}
              </h5>
            </div>
            <div style={{ width: "100%", padding: "20px", margin: "0px auto" }}>
              <span
                style={{
                  color: "#909090",
                  margin: "0px auto",
                  display: "inline-block",
                  textAlign: "left",
                }}
              >
                {announcement.description}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Announcements;
