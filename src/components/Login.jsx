import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../styles/login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setStatus("Logging in...");
    const res = await axios.post("http://localhost:5002/api/auth/login", form); // <-- updated port
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify({
      _id: res.data._id,
      name: res.data.name,
      email: res.data.email
    }));

    setStatus("Login successful ✅");
    setTimeout(() => navigate("/dashboard"), 1000);
  } catch (err) {
    console.error(err);
    setStatus("Invalid credentials ❌");
  }
};
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>🛠 Raw Material Forecasting</h2>
        <h3>Login</h3>

        <form onSubmit={handleSubmit} className="login-form">
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
          <button type="submit">Login</button>
        </form>

        <p className="status">{status}</p>
        <p>
          New user? <Link to="/">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
