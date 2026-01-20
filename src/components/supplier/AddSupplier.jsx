import React, { useState, useEffect } from "react";
import "../../styles/AddSupplier.css";
import API from "../../api/axios";

const AddSupplier = ({ supplierToEdit, onSupplierSaved }) => {
  // supplierToEdit is an object { _id, name, contact, material } when editing
  const [supplier, setSupplier] = useState({
    name: "",
    contact: "",
    material: "",
  });

  // If editing, pre-fill form
  useEffect(() => {
    if (supplierToEdit) {
      setSupplier({
        name: supplierToEdit.name,
        contact: supplierToEdit.contact,
        material: supplierToEdit.material,
      });
    }
  }, [supplierToEdit]);

  const handleChange = (e) => {
    setSupplier({ ...supplier, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, contact, material } = supplier;

    if (!name || !contact || !material) {
      alert("Please fill in all fields");
      return;
    }

    try {
      let data;
      if (supplierToEdit?._id) {
        // Edit mode → PUT request
        const response = await API.put(`/suppliers/${supplierToEdit._id}`, supplier);
        data = response.data;
        alert("Supplier updated successfully!");
      } else {
        // Add mode → POST request
        const response = await API.post("/suppliers", supplier);
        data = response.data;
        alert("Supplier added successfully!");
      }

      // Notify parent to refresh list
      if (onSupplierSaved) onSupplierSaved(data);

      // Clear form
      setSupplier({ name: "", contact: "", material: "" });
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || "Error saving supplier");
    }
  };

  return (
    <div className="add-supplier-page">
      <div className="form-section">
        <h2>{supplierToEdit ? "Edit Supplier" : "Add New Supplier"}</h2>
        <form className="add-supplier-form" onSubmit={handleSubmit}>
          <label>Supplier Name</label>
          <input
            type="text"
            name="name"
            value={supplier.name}
            onChange={handleChange}
            placeholder="Enter supplier name"
            required
          />

          <label>Contact Info (Email/Phone)</label>
          <input
            type="text"
            name="contact"
            value={supplier.contact}
            onChange={handleChange}
            placeholder="Enter contact info"
            required
          />

          <label>Material Supplied</label>
          <input
            type="text"
            name="material"
            value={supplier.material}
            onChange={handleChange}
            placeholder="Enter material"
            required
          />

          <button type="submit">{supplierToEdit ? "Save Changes" : "Add Supplier"}</button>
        </form>
      </div>
    </div>
  );
};

export default AddSupplier;
