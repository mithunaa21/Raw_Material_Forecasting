import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/signup.css";

const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setStatus("Creating account...");

      // Send signup request
      const res = await axios.post("http://localhost:5002/api/auth/signup", form);

      // Save token and user info to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify({
          _id: res.data._id,
          name: res.data.name,
          email: res.data.email,
        })
      );

      setStatus("Signup successful ✅");
      // Redirect to dashboard after 1 second
      setTimeout(() => navigate("/login"), 1000);
    } catch (err) {
      console.error("Signup error:", err.response?.data || err.message);
      setStatus(err.response?.data?.message || "Signup failed ❌");
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-card">
        <h2>🛠 Raw Material Forecasting</h2>
        <h3>Create an Account</h3>

        <form onSubmit={handleSubmit} className="signup-form">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
          <button type="submit">Signup</button>
        </form>

        <p className="status">{status}</p>
        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
