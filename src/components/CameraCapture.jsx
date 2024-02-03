import React, { useEffect } from "react";
import "./CameraCapture.css";

const CameraCapture = () => {
  const [photoTaken, setPhotoTaken] = useState(false);

  const stopStream = () => {
    const video = document.getElementById("video");
    const stream = video.srcObject;
    const tracks = stream.getTracks();

    tracks.forEach((track) => {
      track.stop();
    });

    video.srcObject = null;
  };

  const takepicture = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    const video = document.getElementById("video");
    const photo = document.getElementById("photo");
    const width = 320;
    let height = 0;

    if (width && height) {
      height = video.videoHeight / (video.videoWidth / width);
      canvas.width = width;
      canvas.height = height;
      context.drawImage(video, 0, 0, width, height);

      const data = canvas.toDataURL("image/png");
      photo.setAttribute("src", data);

      setPhotoTaken(true);

      stopStream();
    } else {
      clearPhoto();
    }
  };

  const clearPhoto = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);
    const photo = document.getElementById("photo");
    photo.removeAttribute("src");
    setPhotoTaken(false); // Reset photoTaken state
  };

  useEffect(() => {
    const showViewLiveResultButton = () => {
      if (window.self !== window.top) {
        document.querySelector(".contentarea").remove();
        const button = document.createElement("button");
        button.textContent = "View live result of the example code above";
        document.body.append(button);
        button.addEventListener("click", () => window.open(location.href));
        return true;
      }
      return false;
    };

    const startup = () => {
      if (showViewLiveResultButton()) {
        return;
      }
      const video = document.getElementById("video");
      const canvas = document.getElementById("canvas");
      const photo = document.getElementById("photo");
      const startbutton = document.getElementById("startbutton");

      let streaming = false;
      const width = 320;
      let height = 0;

      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          console.error("An error occurred: ", err);
          alert(
            "Error accessing camera. Please allow camera access and try again."
          );
        });

      video.addEventListener(
        "canplay",
        (ev) => {
          if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);

            if (isNaN(height)) {
              height = width / (4 / 3);
            }

            video.setAttribute("width", width);
            video.setAttribute("height", height);
            canvas.setAttribute("width", width);
            canvas.setAttribute("height", height);
            streaming = true;
          }
        },
        false
      );

      startbutton.addEventListener(
        "click",
        (ev) => {
          takepicture(); // Call the takepicture function here
          ev.preventDefault();
        },
        false
      );

      const clearphoto = () => {
        const context = canvas.getContext("2d");
        context.fillStyle = "#AAA";
        context.fillRect(0, 0, canvas.width, canvas.height);

        const data = canvas.toDataURL("image/png");
        photo.setAttribute("src", data);
      };

      clearphoto();
    };

    window.addEventListener("load", startup, false);
  }, []);

  return (
    <div className="contentarea">
      <div className="camera">
        <video id="video">Video stream not available.</video>
        <button id="startbutton">Take photo</button>
      </div>
      <canvas id="canvas"> </canvas>
      <div className="output">
        <img
          id="photo"
          alt="The screen capture will appear in this box."
          style={{ display: photoTaken ? "block" : "none" }}
        />
      </div>
    </div>
  );
};

export default CameraCapture;
