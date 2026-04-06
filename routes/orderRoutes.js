// routes/orderRoutes.js
import express from "express";
import Order from "../models/Order.js";
import Material from "../models/Material.js";

const router = express.Router();

// Place new order
router.post("/place", async (req, res) => {
  try {
    console.log("📥 Order request received:", req.body);

    const { productId, supplierName, contact, quantity, instructions, requiredDate } = req.body;

    if (!productId || !supplierName || !contact || !quantity || !requiredDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const product = await Material.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newOrder = new Order({
      product: productId,
      supplierName,
      contact,
      quantity,
      instructions,
      requiredDate,
    });

    await newOrder.save();

    res.status(201).json({ message: `✅ Order placed for ${product.materialName}` });
  } catch (err) {
    console.error("❌ Error placing order:", err);
    res.status(500).json({ message: "Failed to place order" });
  }
});

export default router;
