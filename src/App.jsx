import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";
import MainDashboard from "./pages/Dashboard";
// import WorkoutTable from "./pages/WorkoutTable";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<MainDashboard />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
