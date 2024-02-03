import React, { useRef } from "react";

const WebcamVideo = ({ onStartWebcam }) => {
  const videoRef = useRef(null);
  let websocket = null;

  useEffect(() => {
    websocket = new WebSocket("wss://0a3e-182-76-21-121.ngrok-free.app/ws");
    console.log("WebSocket created");

    websocket.onopen = () => {
      console.log("WebSocket connected");
    };

    return () => {
      websocket.close();
    };
  }, []);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = (event) => {
          if (event.data && websocket.readyState === WebSocket.OPEN) {
            websocket.send(event.data);
          }
        };
        mediaRecorder.start();
        // onStartWebcam();
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
  };

  return (
    <div id="webcamComponent">
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
          id="body-posture-video"
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
    </div>
  );
};

export default WebcamVideo;
