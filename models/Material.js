import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    materialName: { type: String, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier", // links to Supplier model
      required: true,
    },
    date: { type: Date, required: true, default: Date.now },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // ✅ New field to track consumption history
    usageLogs: [
      {
        date: { type: Date, default: Date.now },
        consumed: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

const Material = mongoose.model("Material", materialSchema);
export default Material;
