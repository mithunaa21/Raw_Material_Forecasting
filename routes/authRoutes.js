import express from "express";
import { signup, login } from "../controllers/authController.js";

const router = express.Router();

// http://localhost:5002/api/auth/signup
router.post("/signup", signup);

// http://localhost:5002/api/auth/login
router.post("/login", login);

export default router;
