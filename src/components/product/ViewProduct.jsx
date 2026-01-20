import React, { useEffect, useState } from "react";
import "../../styles/ViewProduct.css";
import API from "../../api/axios";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ViewProduct = ({ refreshKey }) => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [formData, setFormData] = useState({
    materialName: "",
    quantity: "",
    category: "",
    supplier: "",
    date: "",
  });
  const [suppliers, setSuppliers] = useState([]);

  // Fetch all materials
  const fetchProducts = async () => {
    try {
      const { data } = await API.get("/materials");
      setProducts(data);
    } catch (err) {
      console.error("Error fetching materials:", err);
      alert("Failed to fetch materials");
    }
  };

  // Fetch suppliers for dropdown
  const fetchSuppliers = async () => {
    try {
      const { data } = await API.get("/suppliers");
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      alert("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchSuppliers();
  }, [refreshKey]);

  // Open edit modal
  const handleEditClick = (product) => {
    setEditProduct(product);
    setFormData({
      materialName: product.materialName,
      quantity: product.quantity,
      category: product.category,
      supplier: product.supplier?._id || "",
      date: product.date ? product.date.split("T")[0] : "",
    });
  };

  // Handle form input change
  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit edited material
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedMaterial = {
        materialName: formData.materialName,
        quantity: Number(formData.quantity),
        category: formData.category,
        supplier: formData.supplier,
        date: formData.date || new Date().toISOString(),
      };

      await API.put(`/materials/${editProduct._id}`, updatedMaterial);
      alert("Material updated successfully!");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating material:", err);
      alert(err.response?.data?.message || "Error updating material");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this material?")) return;

    try {
      await API.delete(`/materials/${id}`);
      alert("Material deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error("Error deleting material:", err);
      alert(err.response?.data?.message || "Error deleting material");
    }
  };

  return (
    <div className="view-product-container">
      <h2>All Materials</h2>
      <table className="product-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Material Name</th>
            <th>Quantity</th>
            <th>Category</th>
            <th>Supplier</th>
            <th>Date of Entry</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="7">No materials added yet.</td>
            </tr>
          ) : (
            products.map((prod) => (
              <tr key={prod._id}>
                <td>{prod._id}</td>
                <td>{prod.materialName}</td>
                <td>{prod.quantity || "-"}</td>
                <td>{prod.category || "-"}</td>
                <td>{prod.supplier?.name || "-"}</td>
                <td>{prod.date ? new Date(prod.date).toLocaleDateString() : "-"}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(prod)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(prod._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Modal */}
      {editProduct && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Material</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Material Name</label>
              <input
                type="text"
                name="materialName"
                value={formData.materialName}
                onChange={handleEditChange}
                required
              />

              <label>Quantity</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleEditChange}
                required
              />

              <label>Category</label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleEditChange}
                required
              />

              <label>Supplier</label>
              <select
                name="supplier"
                value={formData.supplier}
                onChange={handleEditChange}
                required
              >
                <option value="">Select Supplier</option>
                {suppliers.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>

              <label>Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleEditChange}
              />

              <div className="modal-buttons">
                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => setEditProduct(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProduct;
