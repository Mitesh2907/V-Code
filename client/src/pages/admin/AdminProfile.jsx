// src/pages/admin/AdminProfile.jsx
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Shield, 
  Save, 
  CheckCircle, 
  AlertCircle,
  Edit3,
  Camera,
  Loader2,
  BadgeCheck,
  Calendar,
  Clock
} from "lucide-react";
import api from "../../configs/api";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get("/admin/me");
        setAdmin(data.admin);
        setFullName(data.admin.full_name);
      } catch (error) {
        console.error("Failed to load profile", error);
        setErrorMessage("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleUpdate = async () => {
    setUpdating(true);
    setSuccessMessage("");
    setErrorMessage("");
    
    try {
      await api.put("/admin/profile", { fullName });
      setSuccessMessage("Profile updated successfully");
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Update failed");
    } finally {
      setUpdating(false);
    }
  };

  // Get initials from full name
  const getInitials = () => {
    if (!fullName) return "A";
    return fullName
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Format join date (mock - you can replace with actual data if available)
  const joinDate = "January 2024";
  const lastActive = "Today at 10:30 AM";

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0A0A0F] to-black flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full"
        />
      </div>
    );
  }

  if (!admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0A0A0F] to-black flex items-center justify-center p-4">
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-8 text-center max-w-md">
          <AlertCircle className="text-rose-400 mx-auto mb-4" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">Failed to Load Profile</h3>
          <p className="text-gray-400">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-[#0A0A0F] to-black p-4 md:p-8">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-gray-500">Manage your account information and preferences</p>
        </motion.div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden sticky top-6">
              {/* Cover gradient */}
              <div className="h-24 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-gray-800/50" />
              
              {/* Avatar */}
              <div className="relative px-6 pb-6">
                <div className="absolute -top-12 left-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="relative group"
                  >
                    <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-500/25 border-4 border-gray-900">
                      <span className="text-3xl font-bold text-white">
                        {getInitials()}
                      </span>
                    </div>
                    <button className="absolute -bottom-2 -right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-700 transition-colors">
                      <Camera size={16} className="text-gray-400" />
                    </button>
                  </motion.div>
                </div>

                <div className="mt-16">
                  <h2 className="text-xl font-bold text-white">{fullName}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <BadgeCheck size={16} className="text-indigo-400" />
                    <span className="text-sm text-gray-400 capitalize">{admin.role}</span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-3 mt-6">
                    <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                      <Calendar size={16} className="text-indigo-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Joined</p>
                      <p className="text-sm text-white font-medium">{joinDate}</p>
                    </div>
                    <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                      <Clock size={16} className="text-purple-400 mx-auto mb-1" />
                      <p className="text-xs text-gray-500">Last Active</p>
                      <p className="text-sm text-white font-medium">{lastActive}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Edit Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-gray-800/50">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <Edit3 size={18} className="text-indigo-400" />
                  Edit Profile Information
                </h3>
              </div>

              {/* Form */}
              <div className="p-8">
                {/* Success Message */}
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                  >
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 flex items-center gap-3">
                      <CheckCircle className="text-emerald-400 shrink-0" size={20} />
                      <p className="text-sm text-emerald-400">{successMessage}</p>
                    </div>
                  </motion.div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-6"
                  >
                    <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 flex items-center gap-3">
                      <AlertCircle className="text-rose-400 shrink-0" size={20} />
                      <p className="text-sm text-rose-400">{errorMessage}</p>
                    </div>
                  </motion.div>
                )}

                <div className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Mail size={16} className="text-gray-500" />
                      Email Address
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                      <input
                        type="email"
                        value={admin.email}
                        disabled
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed focus:outline-none"
                      />
                    </div>
                    <p className="text-xs text-gray-600 mt-1">Email cannot be changed</p>
                  </div>

                  {/* Full Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      Full Name
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                        placeholder="Enter your full name"
                      />
                    </div>
                  </div>

                  {/* Role Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
                      <Shield size={16} className="text-gray-500" />
                      Role
                    </label>
                    <div className="relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity blur" />
                      <input
                        type="text"
                        value={admin.role}
                        disabled
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-400 cursor-not-allowed focus:outline-none capitalize"
                      />
                    </div>
                  </div>

                  {/* Update Button */}
                  <motion.button
                    onClick={handleUpdate}
                    disabled={updating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="relative w-full group mt-8"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl opacity-80 group-hover:opacity-100 transition-opacity blur group-hover:blur-md" />
                    <div className="relative w-full py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl flex items-center justify-center gap-2">
                      {updating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          <span>Updating Profile...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </div>
                  </motion.button>

                  {/* Last updated info */}
                  <p className="text-xs text-center text-gray-600 mt-4">
                    Last updated: Today at 10:30 AM
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
            >
              <h4 className="text-sm font-semibold text-white mb-4">Account Security</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-gray-400">2FA Enabled</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                  <span className="text-xs text-gray-400">Last Login: 2 hours ago</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full" />
                  <span className="text-xs text-gray-400">Password: 30 days old</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;