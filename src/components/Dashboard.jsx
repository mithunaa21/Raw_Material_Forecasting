import React, { useState, useEffect } from "react";
import {
  FaBox,
  FaUsers,
  FaExclamationTriangle,
  FaTimes,
  FaLayerGroup,
  FaArrowLeft,
} from "react-icons/fa";
import Sidebar from "./Sidebar";
import AddProduct from "./product/AddProduct";
import ViewProduct from "./product/ViewProduct";
import AddSupplier from "./supplier/AddSupplier";
import ViewSupplier from "./supplier/ViewSupplier";
import ForecastReports from "./ForecastReports";
import API from "../api/axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles/dashboard.css";

const LOW_STOCK_THRESHOLD = 20;

const Dashboard = () => {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [productRefreshKey, setProductRefreshKey] = useState(0);
  const [supplierRefreshKey, setSupplierRefreshKey] = useState(0);

  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const handleProductAdded = () => setProductRefreshKey((prev) => prev + 1);
  const handleSupplierAdded = () => setSupplierRefreshKey((prev) => prev + 1);

  // Fetch products every 5 seconds for live updates
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await API.get("/materials");
        setProducts(res.data);

        // Toast notifications for low/out-of-stock
        res.data
          .filter((p) => p.quantity <= LOW_STOCK_THRESHOLD)
          .forEach((p) => {
            if (p.quantity === 0) {
              toast.error(`❌ ${p.materialName} is OUT OF STOCK!`);
            } else {
              toast.warn(`⚠️ ${p.materialName} is running low (${p.quantity} left)`);
            }
          });
      } catch (err) {
        console.error("Error fetching products:", err);
        toast.error("❌ Failed to fetch products");
      }
    };

    fetchProducts();
    const interval = setInterval(fetchProducts, 5000); // live update every 5 sec
    return () => clearInterval(interval);
  }, [productRefreshKey]);

  // Fetch suppliers
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const res = await API.get("/suppliers");
        setSuppliers(res.data);
      } catch (err) {
        console.error("Error fetching suppliers:", err);
      }
    };
    fetchSuppliers();
  }, [supplierRefreshKey]);

  const forecastShortage = (material) => {
    const last3MonthsConsumption = material.last3MonthsConsumption || [30, 35, 40];
    const avgConsumption =
      last3MonthsConsumption.reduce((a, b) => a + b, 0) / last3MonthsConsumption.length;
    const daysLeft = (material.quantity / avgConsumption) * 30;
    return daysLeft < 15
      ? `⚠️ Expected shortage in ~${Math.round(daysLeft)} days`
      : "✅ Stock sufficient";
  };

  const totalStock = products.reduce((sum, p) => sum + p.quantity, 0);
  const lowStock = products.filter((p) => p.quantity <= LOW_STOCK_THRESHOLD);
  const outOfStock = products.filter((p) => p.quantity === 0);

  const storeDashboardData = async () => {
    try {
      if (!products.length) return alert("No products to store!");
      const dashboardData = products.map((p) => ({
        materialId: p._id,
        name: p.materialName,
        quantity: p.quantity,
        forecast: forecastShortage(p),
      }));
      await API.post("/dashboard/store", { dashboardData });
      toast.success("✅ Dashboard data stored successfully!");
    } catch (err) {
      console.error("Error storing dashboard data:", err);
      toast.error("❌ Failed to store dashboard data");
    }
  };

  const backButton = (
    <div className="floating-back" onClick={() => setActiveMenu("dashboard")}>
      <FaArrowLeft />
    </div>
  );

  const renderContent = () => {
    switch (activeMenu) {
      case "addProduct":
        return (
          <>
            {backButton}
            <AddProduct onProductAdded={handleProductAdded} refreshSupplierKey={supplierRefreshKey} />
          </>
        );
      case "viewProduct":
        return (
          <>
            {backButton}
            <ViewProduct refreshKey={productRefreshKey} />
          </>
        );
      case "addSupplier":
        return (
          <>
            {backButton}
            <AddSupplier onSupplierAdded={handleSupplierAdded} />
          </>
        );
      case "viewSupplier":
        return (
          <>
            {backButton}
            <ViewSupplier refreshKey={supplierRefreshKey} />
          </>
        );
      case "reports":
        return (
          <>
            {backButton}
            <ForecastReports />
          </>
        );
      case "profile":
        return (
          <>
            {backButton}
            <h2 className="section-title">👤 Profile</h2>
          </>
        );
      case "settings":
        return (
          <>
            {backButton}
            <h2 className="section-title">⚙️ Settings</h2>
          </>
        );
      default:
        return (
          <div className="main-dashboard">
            <ToastContainer position="top-right" autoClose={3000} />
            <h1>Welcome to RM Forecast Dashboard</h1>

            <button className="store-dashboard-btn" onClick={storeDashboardData}>
              💾 Store Dashboard Data
            </button>

            <div className="cards-grid">
              <div className="card">
                <FaBox className="card-icon" />
                <h3>Total Products</h3>
                <p>{products.length}</p>
              </div>
              <div className="card">
                <FaUsers className="card-icon" />
                <h3>Total Suppliers</h3>
                <p>{suppliers.length}</p>
              </div>
              <div className="card">
                <FaLayerGroup className="card-icon" />
                <h3>Total Stock</h3>
                <p>{totalStock}</p>
              </div>
              <div className="card">
                <FaExclamationTriangle className="card-icon" />
                <h3>Low Stock Items</h3>
                <p>{lowStock.length}</p>
              </div>
              <div className="card">
                <FaTimes className="card-icon" />
                <h3>Out of Stock</h3>
                <p>{outOfStock.length}</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-wrapper">
      <Sidebar setActiveMenu={setActiveMenu} />
      <div className="dashboard-content">{renderContent()}</div>
    </div>
  );
};

export default Dashboard;
