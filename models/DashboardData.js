import mongoose from "mongoose";

const dashboardDataSchema = new mongoose.Schema({
  materialId: { type: mongoose.Schema.Types.ObjectId, ref: "Material", required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  forecast: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("DashboardData", dashboardDataSchema);
