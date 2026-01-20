import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import About from "./components/About";
import AddProduct from "./components/product/AddProduct";
import ReorderPage from "./components/ReorderPage"; // Import ReorderPage

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<About />} />

        {/* Auth routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* Add Product */}
        <Route path="/add-material" element={<AddProduct />} />

        {/* Reorder Page */}
        <Route path="/dashboard/reorder" element={<ReorderPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
