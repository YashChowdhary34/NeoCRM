// src/components/Sidebar.jsx
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiHome,
  FiDollarSign,
  FiUsers,
  FiTrendingUp,
  FiBox,
  FiFileText,
  FiCreditCard,
  FiPieChart,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiX,
  FiMenu,
} from "react-icons/fi";

const Sidebar = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: FiHome, path: "/dashboard" },
    { name: "Invoices", icon: FiFileText, path: "/invoices" },
    { name: "Payments", icon: FiCreditCard, path: "/payments" },
    { name: "Customers", icon: FiUsers, path: "/customers" },
    { name: "Leads", icon: FiTrendingUp, path: "/leads" },
    { name: "Products", icon: FiBox, path: "/products" },
    { name: "Expenses", icon: FiDollarSign, path: "/expenses" },
    { name: "Reports", icon: FiPieChart, path: "/reports" },
    {
      name: "Settings",
      icon: FiSettings,
      subItems: [
        { name: "General", path: "/settings" },
        { name: "Currencies", path: "/currencies" },
        { name: "About", path: "/about" },
        { name: "Help", path: "/help" },
      ],
    },
  ];

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-neon-blue text-dark-bg"
      >
        {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-dark-bg text-white
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-8">NeoCRM</h2>

          <nav className="space-y-2">
            {menuItems.map((item) => (
              <div key={item.name}>
                {item.path ? (
                  <NavLink
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={({ isActive }) => `
                      flex items-center p-3 rounded-lg transition-colors
                      ${
                        isActive
                          ? "bg-neon-blue/20 text-neon-blue border-l-4 border-neon-blue"
                          : "hover:bg-white/10"
                      }
                    `}
                  >
                    <item.icon className="mr-3" />
                    <span>{item.name}</span>
                  </NavLink>
                ) : (
                  <div>
                    <button
                      onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                      className={`
                        w-full flex items-center justify-between p-3 rounded-lg
                        ${
                          location.pathname.startsWith("/settings")
                            ? "bg-neon-blue/20 text-neon-blue"
                            : "hover:bg-white/10"
                        }
                      `}
                    >
                      <div className="flex items-center">
                        <item.icon className="mr-3" />
                        <span>{item.name}</span>
                      </div>
                      {isSettingsOpen ? <FiChevronDown /> : <FiChevronRight />}
                    </button>

                    {isSettingsOpen && (
                      <div className="ml-8 space-y-2">
                        {item.subItems.map((subItem) => (
                          <NavLink
                            key={subItem.path}
                            to={subItem.path}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className={({ isActive }) => `
                              flex items-center p-2 rounded-lg text-sm
                              ${
                                isActive
                                  ? "text-neon-blue"
                                  : "hover:text-neon-blue/70"
                              }
                            `}
                          >
                            {subItem.name}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
