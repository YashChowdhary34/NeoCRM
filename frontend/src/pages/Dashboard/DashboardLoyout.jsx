// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const DashboardLayout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("neocrm_token")) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-light-bg lg:pl-64">
      <Sidebar />

      <main className="p-8">
        <Outlet /> {/* This will render the nested routes */}
      </main>
    </div>
  );
};

export default DashboardLayout;
