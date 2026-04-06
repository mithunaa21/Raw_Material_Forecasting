import express from "express";
import { addSupplier, getSuppliers } from "../controllers/supplierController.js";
import { deleteSupplier,updateSupplier } from "../controllers/supplierController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addSupplier);
router.get("/", protect, getSuppliers);
router.delete("/:id", protect, deleteSupplier); 
router.put("/:id", protect, updateSupplier);

export default router;
