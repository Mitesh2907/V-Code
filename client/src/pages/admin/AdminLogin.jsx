// src/pages/admin/AdminLogin.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, Shield, Eye, EyeOff } from "lucide-react";
import api from "../../configs/api";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Clear form on mount to prevent autofill
  useEffect(() => {
    setForm({ email: "", password: "" });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/admin/login", form);
      localStorage.setItem("admin-token", data.token);
      navigate("/admin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
  // Clear form
  setForm({ email: "", password: "" });

  // 🔐 If already admin logged in → go to dashboard
  const adminToken = localStorage.getItem("admin-token");
  if (adminToken) {
    navigate("/admin");
    return;
  }

  // 🚫 If normal user logged in but not admin → redirect home
  const user = JSON.parse(localStorage.getItem("vcode-user"));
  if (user && user.role !== "admin") {
    navigate("*");
  }

}, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0A0A0F] to-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse animation-delay-4000" />
      </div>

      {/* Grid overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Main card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Glow effect behind card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl blur-2xl opacity-20" />

        {/* Card */}
        <div className="relative bg-gray-900/90 backdrop-blur-xl border border-gray-800/50 rounded-3xl shadow-2xl overflow-hidden">
          {/* Top gradient bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500" />

          {/* Header */}
          <div className="px-8 pt-8 pb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Shield className="text-white" size={20} />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white">V-Code</h1>
                  <p className="text-xs text-gray-500">Admin Portal</p>
                </div>
              </div>
              <div className="px-3 py-1 bg-indigo-500/10 border border-indigo-500/30 rounded-full">
                <span className="text-xs text-indigo-400">Secure Access</span>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-white mb-1">Welcome back</h2>
            <p className="text-sm text-gray-500">Sign in to access the admin dashboard</p>
          </div>

          {/* Error message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mx-8 mb-6"
            >
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4">
                <p className="text-sm text-rose-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-rose-400 rounded-full" />
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* Form - Added autoComplete="off" */}
          <form onSubmit={handleSubmit} autoComplete="off" className="px-8 pb-8 space-y-5">
            {/* Email field - Added unique autocomplete */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-indigo-400 transition-colors" size={18} />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@v-code.com"
                    autoComplete="new-email" // Prevents autofill
                    className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Password field - Added new-password autocomplete */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 block">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-hover:text-indigo-400 transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    autoComplete="new-password" // This is the key! Prevents password autofill
                    className="w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-indigo-600 focus:ring-indigo-500 focus:ring-offset-0"
                />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  Remember me
                </span>
              </label>

              <button
                type="button"
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative w-full group mt-6"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity blur group-hover:blur-md" />
              <div className="relative w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Sign in to dashboard</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </motion.button>

            {/* Security footer */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                <span className="text-xs text-gray-600">SSL Secure</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                <span className="text-xs text-gray-600">2FA Ready</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full" />
                <span className="text-xs text-gray-600">IP Tracking</span>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="px-8 pb-6 text-center border-t border-gray-800/50 pt-6">
            <p className="text-xs text-gray-600">
              Protected by enterprise-grade security • 
              <button className="text-indigo-500 hover:text-indigo-400 ml-1 transition-colors">
                Privacy Policy
              </button>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Animation keyframes */}
      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default AdminLogin;