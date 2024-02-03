import React, { useState } from "react";
import "./Signup.css"; // Import CSS file for styling
import WebcamComponent from "../components/WebcamComponent";

const Signup = () => {
  const [name, setName] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [image, setImage] = useState("");
  const [healthConditions, setHealthConditions] = useState("");
  const [age, setAge] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [focusArea, setFocusArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
  };

  const handleImageCapture = () => {
    // Check if the browser supports media devices and getUserMedia API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Sorry, your browser doesn't support camera access.");
      return;
    }

    // Define constraints for the media stream (in this case, video)
    const constraints = {
      video: true,
    };

    // Access the user's camera
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        // Get the video element to display the camera stream
        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;

        // Append the video element to the document body or any other container
        document.body.appendChild(video);
      })
      .catch((error) => {
        console.error("Error accessing camera:", error);
        alert(
          "Error accessing camera. Please allow camera access and try again."
        );
      });
  };

  return (
    <div className="signup-container">
      <form onSubmit={handleSubmit} className="signup-form">
        <div className="input-group">
          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </label>
        </div>
        <div className="input-group">
          <label>
            Height:
            <input
              type="number"
              step="0.01"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="input-field"
              required
            />
          </label>

          <label>
            Weight:
            <input
              type="number"
              step="0.01"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="input-field"
              required
            />
          </label>

          <label>
            Sex:
            <input
              type="text"
              value={sex}
              onChange={(e) => setSex(e.target.value)}
              className="input-field"
              required
            />
          </label>

          <label>
            Body Type:
            <WebcamComponent onCapture={handleImageCapture} />
          </label>

          <label>
            Health Conditions:
            <input
              type="text"
              value={healthConditions}
              onChange={(e) => setHealthConditions(e.target.value)}
              className="input-field"
            />
          </label>

          <label>
            Age:
            <input
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="input-field"
              required
            />
          </label>

          <label>
            Level of Fitness:
            <select
              value={fitnessLevel}
              onChange={(e) => setFitnessLevel(e.target.value)}
              className="input-field"
              required
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Pro">Pro</option>
            </select>
          </label>

          <label>
            What Part to Focus On:
            <input
              type="text"
              value={focusArea}
              onChange={(e) => setFocusArea(e.target.value)}
              className="input-field"
              required
            />
          </label>
        </div>
        <button type="submit" className="submit-button">
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
