import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Admin from "./pages/Admin";

function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <Link to="/" className="font-bold">Resonance 2025</Link>
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
