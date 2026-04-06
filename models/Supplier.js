import mongoose from "mongoose";

const supplierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  material: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Supplier", supplierSchema);
