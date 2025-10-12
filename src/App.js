import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <Link to="/" className="font-bold">Resonance 2025</Link>
        <div className="text-right leading-tight">
          <div className="text-sm">Union Christian College (Autonomous), Aluva</div>
          <div className="text-xs opacity-90">Union Christian Institute of Management and Technology</div>
        </div>
        {/* <Link to="/admin" className="hover:underline">Admin</Link> */}
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
