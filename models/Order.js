// models/Order.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true,
    },
    supplierName: { type: String, required: true },
    contact: { type: String, required: true },
    quantity: { type: Number, required: true },
    instructions: { type: String },
    requiredDate: { type: Date, required: true },
    status: { type: String, default: "Pending" }, // Pending, Approved, Delivered
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
