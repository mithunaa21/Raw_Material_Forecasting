import React, { useEffect, useState } from "react";
import "../../styles/ViewSupplier.css";
import API from "../../api/axios";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const ViewSupplier = ({ refreshKey }) => {
  const [suppliers, setSuppliers] = useState([]);
  const [editSupplier, setEditSupplier] = useState(null);
  const [formData, setFormData] = useState({ name: "", contact: "", material: "" });
  const [loading, setLoading] = useState(false);

  const fetchSuppliers = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/suppliers");
      setSuppliers(data);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
      alert("Failed to fetch suppliers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, [refreshKey]);

  const handleEditClick = (supplier) => {
    setEditSupplier(supplier);
    setFormData({
      name: supplier.name,
      contact: supplier.contact || "",
      material: supplier.material || "",
    });
  };

  const handleEditChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await API.put(`/suppliers/${editSupplier._id}`, formData);
      alert("Supplier updated successfully!");
      setEditSupplier(null);
      fetchSuppliers();
    } catch (err) {
      console.error("Error updating supplier:", err);
      alert(err.response?.data?.message || "Error updating supplier");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this supplier?")) return;
    try {
      setLoading(true);
      await API.delete(`/suppliers/${id}`);
      alert("Supplier deleted successfully!");
      fetchSuppliers();
    } catch (err) {
      console.error("Error deleting supplier:", err);
      alert(err.response?.data?.message || "Error deleting supplier");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="view-supplier-page">
      <h2>All Suppliers</h2>
      <table className="supplier-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Contact</th>
            <th>Material Supplied</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {suppliers.length === 0 ? (
            <tr>
              <td colSpan="5">{loading ? "Loading..." : "No suppliers added yet."}</td>
            </tr>
          ) : (
            suppliers.map((supplier) => (
              <tr key={supplier._id}>
                <td>{supplier._id}</td>
                <td>{supplier.name}</td>
                <td>{supplier.contact || "-"}</td>
                <td>{supplier.material || "-"}</td>
                <td style={{ display: "flex", gap: "5px" }}>
                  <IconButton
                    color="primary"
                    onClick={() => handleEditClick(supplier)}
                    disabled={loading}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(supplier._id)}
                    disabled={loading}
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
      {editSupplier && (
        <div className="modal">
          <div className="modal-content">
            <h3>Edit Supplier</h3>
            <form onSubmit={handleEditSubmit}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleEditChange}
                required
              />
              <label>Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleEditChange}
              />
              <label>Material Supplied</label>
              <input
                type="text"
                name="material"
                value={formData.material}
                onChange={handleEditChange}
              />
              <div className="modal-buttons">
                <button type="submit" disabled={loading}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => setEditSupplier(null)}
                  disabled={loading}
                >
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

export default ViewSupplier;
