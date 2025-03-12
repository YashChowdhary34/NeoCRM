import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// components - pages
import AuthPage from "./pages/AuthPage";
import Sidebar from "./components/Sidebar";
import DashboardLayout from "./pages/Dashboard/DashboardLoyout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardLayout />} />
        <Route />
      </Routes>
    </Router>
  );
};

export default App;
