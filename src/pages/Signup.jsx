import React, { useEffect, useState } from "react";
import "./Signup.css"; // Import CSS file for styling
import WebcamComponent from "../components/WebcamComponent";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setemail] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [sex, setSex] = useState("");
  const [photoURL, setPhotoURL] = useState();
  const [healthConditions, setHealthConditions] = useState("");
  const [age, setAge] = useState("");
  const [fitnessLevel, setFitnessLevel] = useState("Beginner");
  const [focusArea, setFocusArea] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a JavaScript object with form data
    console.log(photoURL);
    const formData = {
      name: name,
      email: email,
      height: height,
      weight: weight,
      sex: sex,
      image: photoURL,
      healthConditions: healthConditions,
      age: age,
      fitnessLevel: fitnessLevel,
      focusArea: focusArea,
    };

    console.log("Form data:", formData);

    // Example using fetch:
    fetch("https://cb48-182-76-21-121.ngrok-free.app/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log(data);
      })
      .catch((error) => {
        console.error("Error sending data to server:", error);
      });
  };

  useEffect(() => console.log(photoURL), [photoURL]);

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
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setemail(e.target.value)}
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
            <WebcamComponent photoURL={photoURL} setPhotoURL={setPhotoURL} />
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
