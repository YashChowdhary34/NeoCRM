import { useState } from "react";
import { motion } from "framer-motion";
import { FiLock, FiMail, FiUser, FiArrowRight } from "react-icons/fi";
import axios from "axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = `http://localhost:3000/api/${isLogin ? "login" : "signup"}`;
      const response = await axios.post(url, formData);

      localStorage.setItem("neocrm_token", response.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left Section - Auth Form */}
      <div className="bg-light-bg p-8 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <h1 className="text-4xl font-bold text-dark-bg mb-8">
            {isLogin ? "Welcome Back!" : "Get Started"}
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="relative">
                <FiUser className="absolute top-3 left-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-white shadow-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
            )}

            <div className="relative">
              <FiMail className="absolute top-3 left-3 text-gray-400" />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white shadow-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>

            <div className="relative">
              <FiLock className="absolute top-3 left-3 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 rounded-lg bg-white shadow-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-neon-blue text-dark-bg py-3 rounded-lg font-semibold
                flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all"
            >
              {loading ? (
                "Processing..."
              ) : (
                <>
                  {isLogin ? "Sign In" : "Create Account"}
                  <FiArrowRight />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-neon-blue font-semibold hover:underline"
            >
              {isLogin ? "Sign up" : "Login"}
            </button>
          </p>
        </motion.div>
      </div>

      {/* Right Section - Branding */}
      <div
        className="bg-gradient-to-br from-dark-bg to-blue-900 p-12 hidden lg:flex
        items-center justify-center text-white relative overflow-hidden"
      >
        <div className="relative z-10 max-w-2xl">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-5xl font-bold mb-6">NeoCRM</h1>
            <p className="text-xl mb-8">
              Transform your customer relationships with our AI-powered CRM
              platform. Manage leads, track interactions, and boost your sales
              productivity.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                  <FiArrowRight className="text-dark-bg" />
                </div>
                <span>Intelligent lead scoring</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                  <FiArrowRight className="text-dark-bg" />
                </div>
                <span>Real-time analytics and predictions dashboard</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                  <FiArrowRight className="text-dark-bg" />
                </div>
                <span>Team collaboration tools</span>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-neon-blue rounded-full flex items-center justify-center">
                  <FiArrowRight className="text-dark-bg" />
                </div>
                <span>AI agents</span>
              </div>
            </div>
          </motion.div>

          {/* Animated background elements */}
          <div
            className="absolute -top-20 -right-20 w-96 h-96 bg-neon-blue/10 rounded-full
            blur-3xl animate-float"
          />
          <div
            className="absolute bottom-0 left-0 w-64 h-64 bg-neon-blue/10 rounded-full
            blur-3xl animate-float delay-1000"
          />
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
