import React from "react";
import { NavLink } from "react-router-dom";

const DashboardSidebar = () => {
  return (
    <div>
      <h2>Admin Panel</h2>
      <nav>
        <Navlink to="/dashboard">Dashboard</Navlink>
        <Navlink to="/dashboard/data-management">Data Management</Navlink>
      </nav>
    </div>
  );
};

export default DashboardSidebar;
