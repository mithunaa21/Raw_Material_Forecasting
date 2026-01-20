// ForecastReports.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/reports.css";

const LOW_STOCK_THRESHOLD = 20;

const ForecastReports = () => {
  const [products, setProducts] = useState([]);
  const [updatingQuantity, setUpdatingQuantity] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  // Fetch products every 5 seconds
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/materials");
        setProducts(res.data);

        // Low stock/out of stock notifications
        res.data
          .filter((p) => p.quantity <= LOW_STOCK_THRESHOLD)
          .forEach((p) => {
            if (p.quantity === 0) toast.error(`❌ ${p.materialName} is OUT OF STOCK!`);
            else toast.warn(`⚠️ ${p.materialName} is running low (${p.quantity} left)`);
          });
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("❌ Failed to fetch products");
      }
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 5000);
    return () => clearInterval(interval);
  }, []);

  // Forecast logic
  const forecastShortage = (material) => {
    const last3MonthsConsumption = material.last3MonthsConsumption || [30, 35, 40];
    const avgConsumption =
      last3MonthsConsumption.reduce((a, b) => a + b, 0) / last3MonthsConsumption.length;
    const daysLeft = (material.quantity / avgConsumption) * 30;
    return daysLeft < 15
      ? `⚠️ Expected shortage in ~${Math.round(daysLeft)} days`
      : "✅ Stock sufficient";
  };

  // Quantity update
  const handleQuantityChange = (productId, value) => {
    setUpdatingQuantity((prev) => ({ ...prev, [productId]: value }));
  };

  const handleUpdateQuantity = async (productId) => {
    try {
      const product = products.find((p) => p._id === productId);
      if (!product) return toast.error("Product not found");

      const newQuantity = Number(
        updatingQuantity[productId] !== undefined
          ? updatingQuantity[productId]
          : product.quantity
      );

      if (isNaN(newQuantity) || newQuantity < 0) {
        toast.error("Quantity must be a positive number");
        return;
      }

      await API.put(`/materials/update/${productId}`, { quantity: newQuantity });

      setProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, quantity: newQuantity } : p))
      );

      setUpdatingQuantity((prev) => {
        const copy = { ...prev };
        delete copy[productId];
        return copy;
      });

      toast.success("✅ Quantity updated successfully!");
    } catch (err) {
      console.error("Error updating quantity:", err);
      toast.error("❌ Failed to update quantity");
    }
  };

  // Navigate to Reorder page
  const handleReorder = (product) => {
    navigate("/dashboard/reorder", { state: { product } });
  };

  // Filter products
  const filteredProducts = products.filter((p) =>
    p.materialName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="forecast-alerts">
      <ToastContainer position="top-right" autoClose={3000} />
      <h2>📊 Reports: Product Stock & Forecast</h2>

      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Forecast</th>
            <th>Supplier</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((p) => (
            <tr key={p._id}>
              <td>{p.materialName}</td>
              <td>{p.quantity}</td>
              <td>{forecastShortage(p)}</td>
              <td>{p.supplier?.name || "N/A"}</td>
              <td>
                <input
                  type="number"
                  min="0"
                  value={updatingQuantity[p._id] ?? p.quantity}
                  onChange={(e) => handleQuantityChange(p._id, e.target.value)}
                />
                <button onClick={() => handleUpdateQuantity(p._id)}>Update</button>
                {p.quantity <= LOW_STOCK_THRESHOLD && (
                  <button className="order-btn" onClick={() => handleReorder(p)}>
                    🛒 Reorder
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ForecastReports;
