import React, { useState, useEffect, useRef } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import Webcam from "react-webcam";
import "../App.css";

function WorkoutTable() {
  const [workoutData, setWorkoutData] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [selectedSet, setSelectedSet] = useState(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isStartButtonDisabled, setIsStartButtonDisabled] = useState(false);
  const webcamRef = useRef(null);
  const videoRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // WebSocket Connection
    const socket = new WebSocket("wss://0.tcp.in.ngrok.io:18913/ws");
    socket.onopen = () => {
      console.log("WebSocket connected");
      setSocket(socket);
    };
    socket.onclose = () => console.log("WebSocket disconnected");
    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);

  useEffect(() => {
    fetch("/data.json")
      .then((response) => response.json())
      .then((data) => setWorkoutData(data))
      .catch((error) => console.error("Error fetching workout data:", error));
  }, []);

  useEffect(() => {
    alanBtn({
      key: "cb6ef25db7a2a4cdeb5ddd68c14411f92e956eca572e1d8b807a3e2338fdd0dc/stage",
      onCommand: (commandData) => {
        if (commandData.command === "showWorkouts") {
          const { day } = commandData.data;
          handleDayClick(day);
        }
      },
    });
  }, []);

  const handleDayClick = (day) => {
    setSelectedDay(selectedDay === day ? null : day);
  };

  const startStreaming = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      console.log("STARTED 1");
      if (videoRef.current) {
        console.log("STARTED 2");
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
        if (socket && socket.readyState === WebSocket.OPEN) {
          stream.getTracks().forEach((track) => {
            socket.send(track);
          });
        }
      }
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };

  const stopStreaming = () => {
    if (videoRef.current) {
      const stream = videoRef.current.srcObject;
      if (stream) {
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          track.stop();
        });
        videoRef.current.srcObject = null;
      }
      setIsStreaming(false);
      setIsStartButtonDisabled(true);
    }
  };

  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <div>
        <h2>Workout Routine</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Exercise</th>
              <th>Set</th>
              <th>Reps</th>
              <th>Rest</th>
              <th>Proceed</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(workoutData).map((day) => (
              <>
                <tr
                  key={day}
                  onClick={() => handleDayClick(day)}
                  className={selectedDay === day ? "selected-day" : ""}
                >
                  <td>
                    <strong>{day}</strong>
                  </td>
                  <td colSpan="5"></td>
                </tr>
                {selectedDay === day &&
                  Object.keys(workoutData[day]).map((exercise) =>
                    Object.keys(workoutData[day][exercise]).map((set) => (
                      <tr key={`${day}-${exercise}-${set}`}>
                        <td></td>
                        <td>{exercise}</td>
                        <td>{set}</td>
                        <td>
                          {workoutData[day][exercise][set].Reps ||
                            workoutData[day][exercise][set].Duration}
                        </td>
                        <td>{workoutData[day][exercise][set].Rest}</td>
                        <td>
                          {isStreaming ? (
                            <button onClick={stopStreaming}>Stop</button>
                          ) : (
                            <button onClick={startStreaming}>Start</button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
              </>
            ))}
          </tbody>
        </table>
      </div>
      <div className="live-stream-container">
        <video
          id="video"
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100vh", height: "auto", marginTop: "-40vh" }}
        />
      </div>
    </div>
  );
}

export default WorkoutTable;
