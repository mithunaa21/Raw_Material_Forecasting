import Material from "../models/Material.js";

// Add new material
export const addMaterial = async (req, res) => {
  try {
    const { materialName, category, quantity, supplier, date } = req.body;

    if (!materialName || !category || quantity == null || !supplier) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const material = await Material.create({
      materialName,
      category,
      quantity,
      supplier, // must be valid ObjectId of Supplier
      date: date || new Date(),
      user: req.user?._id,
    });

    const populatedMaterial = await material.populate("supplier", "name");
    res.status(201).json(populatedMaterial);
  } catch (err) {
    console.error("Error adding material:", err);
    res.status(500).json({ message: err.message });
  }
};

// Get all materials
export const getMaterials = async (req, res) => {
  try {
    const materials = await Material.find().populate("supplier", "name");
    res.json(materials);
  } catch (err) {
    console.error("Error fetching materials:", err);
    res.status(500).json({ message: err.message });
  }
};

// Update material
export const updateMaterial = async (req, res) => {
  try {
    const { id } = req.params;
    const { materialName, category, quantity, supplier, date } = req.body;

    if (!materialName || !category || quantity == null || !supplier) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const updatedMaterial = await Material.findByIdAndUpdate(
      id,
      { materialName, category, quantity, supplier, date },
      { new: true, runValidators: true }
    ).populate("supplier", "name");

    if (!updatedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }

    res.json(updatedMaterial);
  } catch (err) {
    console.error("Error updating material:", err);
    res.status(500).json({ message: "Error updating material" });
  }
};

// Delete material
export const deleteMaterial = async (req, res) => {
  try {
    const deletedMaterial = await Material.findByIdAndDelete(req.params.id);
    if (!deletedMaterial) {
      return res.status(404).json({ message: "Material not found" });
    }
    res.json({ message: "Material deleted successfully" });
  } catch (err) {
    console.error("Error deleting material:", err);
    res.status(500).json({ message: "Error deleting material" });
  }
};
