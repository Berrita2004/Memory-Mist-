import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./Signup";
import MemoryUpload from "./MemoryUpload";
import MemoryDisplay from "./MemoryDisplay";
import HomePage from "./HomePage"; // ✅ new import

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/home" element={<HomePage />} /> {/* ✅ New HomePage route */}
        <Route path="/upload" element={<MemoryUpload />} />
        <Route path="/memories" element={<MemoryDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;
