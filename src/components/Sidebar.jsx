import React, { useState } from "react";
import "../styles/dashboard.css"; // new CSS

const Sidebar = ({ setActiveMenu }) => {
  const [openMenu, setOpenMenu] = useState("");

  const toggleMenu = (menu) => {
    setOpenMenu(openMenu === menu ? "" : menu);
  };

  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">📦 RM Forecast</h2>

      <div className="menu-section">
        <button className="menu-btn" onClick={() => toggleMenu("products")}>
          Products
        </button>
        {openMenu === "products" && (
          <div className="submenu">
            <button onClick={() => setActiveMenu("addProduct")}>Add Product</button>
            <button onClick={() => setActiveMenu("viewProduct")}>View Products</button>
          </div>
        )}
      </div>

      <div className="menu-section">
        <button className="menu-btn" onClick={() => toggleMenu("suppliers")}>
          Suppliers
        </button>
        {openMenu === "suppliers" && (
          <div className="submenu">
            <button onClick={() => setActiveMenu("addSupplier")}>Add Supplier</button>
            <button onClick={() => setActiveMenu("viewSupplier")}>View Suppliers</button>
          </div>
        )}
      </div>

      <div className="menu-section">
        <button className="menu-btn" onClick={() => setActiveMenu("reports")}>Reports</button>
        <button className="menu-btn" onClick={() => setActiveMenu("profile")}>Profile</button>
        <button className="menu-btn" onClick={() => setActiveMenu("settings")}>Settings</button>
      </div>
    </aside>
  );
};

export default Sidebar;
