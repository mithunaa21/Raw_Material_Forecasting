import express from "express";
import {
  addMaterial,
  getMaterials,
  updateMaterial,
  deleteMaterial,
} from "../controllers/materialController.js";
import protect from "../middleware/authMiddleware.js";
import Material from "../models/Material.js";

const router = express.Router();

// ✅ Existing CRUD routes
router.get("/", protect, getMaterials);
router.post("/", protect, addMaterial);
router.put("/:id", protect, updateMaterial);
router.delete("/:id", protect, deleteMaterial);

// ✅ Usage-rate Predictive Forecasting Route
router.get("/alerts", protect, async (req, res) => {
  try {
    const materials = await Material.find();
    const alerts = [];

    materials.forEach((m) => {
      if (!m.usageLogs || m.usageLogs.length === 0) return;

      // Sort usage logs by date
      const sortedLogs = m.usageLogs.sort(
        (a, b) => new Date(a.date) - new Date(b.date)
      );

      const firstDate = new Date(sortedLogs[0].date);
      const lastDate = new Date(sortedLogs[sortedLogs.length - 1].date);
      const days = (lastDate - firstDate) / (1000 * 60 * 60 * 24) || 1; // avoid division by zero

      // Calculate average daily usage
      const totalConsumed = sortedLogs.reduce((sum, log) => sum + log.consumed, 0);
      const dailyUsage = totalConsumed / days;

      // Predict days left
      const daysLeft = m.quantity / dailyUsage;

      // Trigger alert if predicted stockout in less than 7 days
      if (daysLeft < 7) {
        alerts.push({
          materialId: m._id,
          materialName: m.materialName,
          quantity: m.quantity,
          dailyUsage: dailyUsage.toFixed(2),
          predictedDaysLeft: Math.floor(daysLeft),
          message: `${m.materialName} may run out in ${Math.floor(
            daysLeft
          )} days (daily usage: ${dailyUsage.toFixed(2)}).`,
        });
      }
    });

    res.json(alerts);
  } catch (err) {
    console.error("Error fetching predictive alerts:", err);
    res.status(500).json({ message: "Error fetching predictive alerts", error: err });
  }
});

export default router;
