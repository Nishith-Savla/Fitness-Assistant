import React, { useState, useRef } from "react";

const WebcamComponent = () => {
  const videoRef = useRef(null);
  const [photoURL, setPhotoURL] = useState("");

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const takePhoto = () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext("2d");
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoURL = canvas.toDataURL("image/png");
    setPhotoURL(photoURL);
    console.log(photoURL);
  };

  return (
    <div>
      <button
        onClick={startWebcam}
        style={{
          padding: "10px",
          backgroundColor: "#0056b3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          marginRight: "10px",
        }}
      >
        Start Webcam
      </button>

      <div>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", height: "auto" }}
        />
      </div>

      <button
        onClick={takePhoto}
        style={{
          padding: "10px",
          backgroundColor: "#0056b3",
          color: "white",
          border: "none",
          borderRadius: "5px",
          margin: "10px 0 10px 0",
        }}
      >
        Take Photo
      </button>
      {photoURL && (
        <div>
          <h2>Preview</h2>
          <img
            src={photoURL}
            alt="Captured"
            style={{ width: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default WebcamComponent;
