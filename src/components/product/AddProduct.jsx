import React, { useState, useEffect } from "react";
import "../../styles/AddProduct.css";
import API from "../../api/axios";

const AddProduct = ({ onProductAdded, refreshSupplierKey }) => {
  const [formData, setFormData] = useState({
    materialName: "",
    quantity: "",
    category: "",
    customCategory: "",
    supplier: "",
    date: "",
  });

  const [suppliers, setSuppliers] = useState([]);

  // Fetch suppliers from backend
  const fetchSuppliers = async () => {
    try {
      const { data } = await API.get("/suppliers");
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  // Fetch initially and whenever refreshSupplierKey changes
  useEffect(() => {
    fetchSuppliers();
  }, [refreshSupplierKey]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  const finalCategory =
    formData.category === "Others" ? formData.customCategory : formData.category;

  const materialData = {
    materialName: formData.materialName, // <-- correct field
    quantity: formData.quantity,
    category: finalCategory,
    supplier: formData.supplier,
    date: formData.date || new Date(),
  };

  try {
    const { data } = await API.post("/materials", materialData);
    alert("Material added successfully!");

    if (onProductAdded) onProductAdded(data); // notify parent to refresh ViewProduct

    setFormData({
      materialName: "",
      quantity: "",
      category: "",
      customCategory: "",
      supplier: "",
      date: "",
    });
  } catch (err) {
    console.error("Error adding material:", err);
    alert(err.response?.data?.message || "Error adding material");
  }
};

  return (
    <div className="add-product-container">
      <div className="info-section">
        <h1>📦 Manage Your Materials</h1>
        <p>
          Add and manage raw materials efficiently. Track quantity, supplier, and category to ensure smooth workflow.
        </p>
      </div>

      <div className="form-section">
        <h2>Add New Material</h2>
        <form onSubmit={handleSubmit} className="product-form">
          <label>Material Name</label>
          <input
            type="text"
            name="materialName"
            value={formData.materialName}
            onChange={handleChange}
            placeholder="Enter material name"
            required
          />

          <label>Quantity</label>
          <input
            type="number"
            name="quantity"
            value={formData.quantity}
            onChange={handleChange}
            placeholder="Enter quantity"
            required
          />

          <label>Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          >
            <option value="">Select Category</option>
            <option value="Metal">Metal</option>
            <option value="Wood">Wood</option>
            <option value="Plastic">Plastic</option>
            <option value="Chemicals">Chemicals</option>
            <option value="Others">Others</option>
          </select>

          {formData.category === "Others" && (
            <>
              <label>Custom Category</label>
              <input
                type="text"
                name="customCategory"
                value={formData.customCategory}
                onChange={handleChange}
                placeholder="Enter custom category"
                required
              />
            </>
          )}

          <label>Supplier</label>
          <select
            name="supplier"
            value={formData.supplier}
            onChange={handleChange}
            required
          >
            <option value="">Select Supplier</option>
            {suppliers.map((s) => (
              <option key={s._id} value={s._id}>
                {s.name}
              </option>
            ))}
          </select>

          <label>Date of Entry</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
          />

          <button type="submit" className="submit-btn">
            Save Material
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
