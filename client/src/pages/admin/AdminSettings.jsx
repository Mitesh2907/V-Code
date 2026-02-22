// src/pages/admin/AdminSettings.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lock,
  Key,
  Shield,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Loader2,
  Save,
  Info,
  AlertTriangle,
  Fingerprint,
  KeyRound,
  Monitor,
  Smartphone,
  Laptop,
  Activity,
  ShieldCheck,
} from "lucide-react";
import api from "../../configs/api";

const AdminSettings = () => {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [activeTab, setActiveTab] = useState("password"); // 'password', 'security', 'preferences'

  // Clear form on mount to prevent autofill
  useEffect(() => {
    setForm({
      currentPassword: "",
      newPassword: "",
    });
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    
    // Clear message when user starts typing
    if (message) setMessage("");
    
    // Calculate password strength for new password
    if (e.target.name === "newPassword") {
      calculatePasswordStrength(e.target.value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Complexity checks
    if (/[A-Z]/.test(password)) strength += 15;
    if (/[a-z]/.test(password)) strength += 15;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 20;
    
    // Cap at 100
    setPasswordStrength(Math.min(strength, 100));
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return "bg-rose-500";
    if (passwordStrength < 60) return "bg-amber-500";
    if (passwordStrength < 80) return "bg-yellow-500";
    return "bg-emerald-500";
  };

  const getStrengthText = () => {
    if (passwordStrength < 30) return "Weak";
    if (passwordStrength < 60) return "Fair";
    if (passwordStrength < 80) return "Good";
    return "Strong";
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage("");
    
    try {
      const { data } = await api.put("/admin/change-password", form);
      setMessage(data.message);
      setMessageType("success");
      setForm({ currentPassword: "", newPassword: "" });
      setPasswordStrength(0);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } catch (error) {
      setMessage(error.response?.data?.message || "Update failed");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0A0A0F] to-black p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-40 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-40 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Settings</h1>
          <p className="text-gray-500">Manage your account security and preferences</p>
        </motion.div>

        {/* Settings Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-6"
        >
          {[
            { id: "password", label: "Password", icon: Key },
            { id: "security", label: "Security", icon: Shield },
            { id: "preferences", label: "Preferences", icon: Monitor },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/25"
                    : "bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 border border-gray-700"
                }`}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Security Status */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden sticky top-6">
              {/* Header */}
              <div className="px-6 py-5 border-b border-gray-800/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-400" />
                  Security Status
                </h3>
              </div>

              <div className="p-6">
                {/* Security Score */}
                <div className="text-center mb-6">
                  <div className="relative inline-flex">
                    <div className="w-24 h-24 rounded-full bg-gray-800 flex items-center justify-center">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">85</span>
                      </div>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Shield size={12} className="text-white" />
                    </div>
                  </div>
                  <p className="text-sm text-gray-400 mt-3">Security Score</p>
                  <p className="text-xs text-emerald-400">Good</p>
                </div>

                {/* Security Features */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/20 rounded-lg">
                        <Lock size={16} className="text-emerald-400" />
                      </div>
                      <span className="text-sm text-gray-300">2FA</span>
                    </div>
                    <span className="text-xs px-2 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">
                      Enabled
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-amber-500/20 rounded-lg">
                        <Key size={16} className="text-amber-400" />
                      </div>
                      <span className="text-sm text-gray-300">Password Age</span>
                    </div>
                    <span className="text-xs text-gray-400">30 days</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Fingerprint size={16} className="text-indigo-400" />
                      </div>
                      <span className="text-sm text-gray-300">Last Login</span>
                    </div>
                    <span className="text-xs text-gray-400">2 hours ago</span>
                  </div>
                </div>

                {/* Recommendations */}
                <div className="mt-6 pt-6 border-t border-gray-800/50">
                  <h4 className="text-xs font-medium text-gray-400 mb-3">RECOMMENDATIONS</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" />
                      <span>Update password regularly</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-500">
                      <Info size={12} className="text-indigo-400 shrink-0 mt-0.5" />
                      <span>Enable 2FA for extra security</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Settings Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <KeyRound size={18} className="text-indigo-400" />
                  Change Password
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Update your password to keep your account secure
                </p>
              </div>

              {/* Form */}
              <div className="p-8">
                {/* Message */}
                <AnimatePresence>
                  {message && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mb-6"
                    >
                      <div className={`rounded-xl p-4 flex items-start gap-3 ${
                        messageType === "success" 
                          ? "bg-emerald-500/10 border border-emerald-500/30" 
                          : "bg-rose-500/10 border border-rose-500/30"
                      }`}>
                        {messageType === "success" ? (
                          <CheckCircle className="text-emerald-400 shrink-0" size={20} />
                        ) : (
                          <AlertCircle className="text-rose-400 shrink-0" size={20} />
                        )}
                        <p className={`text-sm ${
                          messageType === "success" ? "text-emerald-400" : "text-rose-400"
                        }`}>
                          {message}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-6">
                  {/* Current Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Lock size={16} className="text-gray-500" />
                      Current Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={form.currentPassword}
                          onChange={handleChange}
                          placeholder="Enter current password"
                          autoComplete="off"
                          className="w-full pl-4 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                        >
                          {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Key size={16} className="text-gray-500" />
                      New Password
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={form.newPassword}
                          onChange={handleChange}
                          placeholder="Enter new password"
                          autoComplete="new-password"
                          className="w-full pl-4 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-indigo-400 transition-colors"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {form.newPassword && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-3 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${passwordStrength}%` }}
                              className={`h-full ${getStrengthColor()}`}
                            />
                          </div>
                          <span className="text-xs text-gray-400 ml-3 min-w-[40px]">
                            {getStrengthText()}
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className={`flex items-center gap-1 ${
                            form.newPassword.length >= 8 ? 'text-emerald-400' : 'text-gray-600'
                          }`}>
                            <CheckCircle size={10} />
                            <span>8+ characters</span>
                          </div>
                          <div className={`flex items-center gap-1 ${
                            /[A-Z]/.test(form.newPassword) ? 'text-emerald-400' : 'text-gray-600'
                          }`}>
                            <CheckCircle size={10} />
                            <span>Uppercase</span>
                          </div>
                          <div className={`flex items-center gap-1 ${
                            /[0-9]/.test(form.newPassword) ? 'text-emerald-400' : 'text-gray-600'
                          }`}>
                            <CheckCircle size={10} />
                            <span>Number</span>
                          </div>
                          <div className={`flex items-center gap-1 ${
                            /[^A-Za-z0-9]/.test(form.newPassword) ? 'text-emerald-400' : 'text-gray-600'
                          }`}>
                            <CheckCircle size={10} />
                            <span>Special char</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Password Requirements */}
                  <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-xl p-4">
                    <h4 className="text-xs font-medium text-indigo-400 mb-2 flex items-center gap-1">
                      <Info size={12} />
                      Password Requirements
                    </h4>
                    <ul className="space-y-1 text-xs text-gray-500">
                      <li>• Minimum 8 characters long</li>
                      <li>• At least one uppercase letter</li>
                      <li>• At least one number</li>
                      <li>• At least one special character</li>
                    </ul>
                  </div>

                  {/* Update Button */}
                  <motion.button
                    onClick={handleSubmit}
                    disabled={loading || !form.currentPassword || !form.newPassword}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full group mt-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity blur group-hover:blur-md" />
                    <div className="relative w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                      {loading ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Updating Password...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Update Password</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Security Tips */}
                  <div className="mt-6 pt-6 border-t border-gray-800/50">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-indigo-500/20 rounded-lg">
                        <Shield size={16} className="text-indigo-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-white mb-1">Security Tips</h4>
                        <p className="text-xs text-gray-500">
                          Use a unique password that you don't use for other websites. 
                          Consider using a password manager to generate and store strong passwords.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mt-6 bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
            >
              <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
                <Activity size={16} className="text-indigo-400" />
                Recent Account Activity
              </h4>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Laptop size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white">Chrome on Windows</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.1 • New York, US</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Smartphone size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white">Safari on iPhone</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.2 • London, UK</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-lg flex items-center justify-center">
                      <Monitor size={14} className="text-gray-400" />
                    </div>
                    <div>
                      <p className="text-white">Firefox on macOS</p>
                      <p className="text-xs text-gray-600">IP: 192.168.1.3 • Tokyo, JP</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 days ago</span>
                </div>
              </div>

              <button className="mt-4 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                View all activity
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Animation keyframes */}
      <style>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default AdminSettings;