import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/reorder.css";

const ReorderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const product = location.state?.product;

  const [formData, setFormData] = useState({
    productId: product?._id || "",
    productName: product?.materialName || "",
    supplierName: product?.supplier?.name || "",
    contact: "",
    quantity: 50,
    instructions: "",
    requiredDate: "",
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { supplierName, contact, quantity, requiredDate } = formData;

    if (!supplierName || !contact || !quantity || !requiredDate) {
      return toast.error("Please fill all required fields");
    }

    try {
      await API.post("/orders/place", formData);
      toast.success(`🛒 Order placed for ${formData.productName}`);
      navigate("/dashboard/reports");
    } catch (err) {
      console.error(err);
      toast.error("❌ Failed to place order");
    }
  };

  return (
    <div className="reorder-page">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="reorder-card">
        <h2>Reorder: {formData.productName}</h2>
        <form className="reorder-form" onSubmit={handleSubmit}>
          <label>Supplier Name *</label>
          <input
            type="text"
            value={formData.supplierName}
            onChange={(e) => handleChange("supplierName", e.target.value)}
          />
          <label>Contact (Email/Mobile) *</label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => handleChange("contact", e.target.value)}
          />
          <label>Quantity *</label>
          <input
            type="number"
            min="1"
            value={formData.quantity}
            onChange={(e) => handleChange("quantity", e.target.value)}
          />
          <label>Instructions</label>
          <textarea
            value={formData.instructions}
            onChange={(e) => handleChange("instructions", e.target.value)}
          />
          <label>Required Date *</label>
          <input
            type="date"
            value={formData.requiredDate}
            onChange={(e) => handleChange("requiredDate", e.target.value)}
          />
          <div className="form-buttons">
            <button type="submit">Place Order</button>
            <button type="button" onClick={() => navigate(-1)}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReorderPage;
