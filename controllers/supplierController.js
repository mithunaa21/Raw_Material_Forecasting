import Supplier from "../models/Supplier.js";

// @desc Add new supplier
// @route POST /api/suppliers
export const addSupplier = async (req, res) => {
  try {
    const { name, contact, material } = req.body;

    // Validate input
    if (!name || !contact || !material) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if supplier already exists (by name)
    const exists = await Supplier.findOne({ name });
    if (exists) {
      return res.status(400).json({ message: "Supplier already exists" });
    }

    // Create supplier with full details
    const supplier = await Supplier.create({ name, contact, material });

    res.status(201).json(supplier);
  } catch (err) {
    console.error("Error in addSupplier:", err);
    res.status(500).json({ message: err.message });
  }
};

// @desc Get all suppliers
// @route GET /api/suppliers
export const getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    console.error("Error in getSuppliers:", err);
    res.status(500).json({ message: err.message });
  }
};
// @desc Delete a supplier
// @route DELETE /api/suppliers/:id
export const deleteSupplier = async (req, res) => {
  try {
    const supplier = await Supplier.findById(req.params.id);

    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    await supplier.deleteOne(); // or supplier.remove()
    res.json({ message: "Supplier deleted successfully" });
  } catch (err) {
    console.error("Error in deleteSupplier:", err);
    res.status(500).json({ message: err.message });
  }
};
// @desc Update supplier
// @route PUT /api/suppliers/:id
export const updateSupplier = async (req, res) => {
  try {
    const { name, contact, material } = req.body;

    // Validate fields
    if (!name || !contact || !material) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Find supplier by ID
    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) {
      return res.status(404).json({ message: "Supplier not found" });
    }

    // Update fields
    supplier.name = name;
    supplier.contact = contact;
    supplier.material = material;

    // Save changes
    const updatedSupplier = await supplier.save();

    res.json(updatedSupplier);
  } catch (err) {
    console.error("Error updating supplier:", err);
    res.status(500).json({ message: err.message });
  }
};

