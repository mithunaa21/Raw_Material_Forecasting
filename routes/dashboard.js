import express from "express";
import { storeDashboardData, getDashboardData } from "../controllers/dashboardController.js";

const router = express.Router();

// POST /dashboard/store
router.post("/store", storeDashboardData);

// GET /dashboard
router.get("/", getDashboardData);

export default router;
