// frontend/src/api/axios.js
import axios from "axios";

// Create an axios instance with a base URL
const API = axios.create({
  baseURL: "http://localhost:5002/api", // 👈 include /api to match backend
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach token automatically if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
