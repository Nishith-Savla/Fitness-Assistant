import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import ExerciseDetail from "./pages/ExerciseDetail";
import Signup from "./pages/Signup";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import "./App.css";

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercise/:id" element={<ExerciseDetail />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
