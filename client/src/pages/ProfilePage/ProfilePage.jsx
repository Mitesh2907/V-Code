import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Button from "../../components/common/Button/Button";
import api from "../../configs/api";
import toast from "react-hot-toast";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState(user?.fullName || "");
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user) return null;

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      await api.put("/auth/update-profile", { name });
      toast.success("Profile updated successfully");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
  try {
    setLoading(true);

    const { data } = await api.put("/auth/change-password", {
      currentPassword,
      newPassword,
    });

    if (!data.success) {
      return toast.error(data.message);
    }

    toast.success(data.message);

  } catch (err) {
    const message =
      err.response?.data?.message || "Something went wrong";

    toast.error(message);
  } finally {
    setLoading(false);
  }
};


  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0b1220] pt-28 pb-16 px-4">
      <div className="max-w-4xl mx-auto">

        <div className="bg-white dark:bg-[#111827] 
                        border border-gray-200 dark:border-gray-700
                        rounded-2xl shadow-xl shadow-black/5 dark:shadow-black/30 p-8">

          {/* Top Gradient Strip */}
          <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-purple-600 rounded mb-8"></div>

          {/* Profile Header */}
          <div className="flex items-center space-x-6 mb-10">
            <div className="w-20 h-20 rounded-full 
                            bg-gradient-to-br from-blue-500 to-purple-600 
                            flex items-center justify-center 
                            text-white text-2xl font-bold shadow-lg">
              {user.fullName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
                {user.fullName}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                {user.email}
              </p>
            </div>
          </div>

          {/* Personal Info */}
          <div className="mb-12">
            <h3 className="text-lg font-semibold mb-6 text-gray-900 dark:text-white">
              Personal Information
            </h3>

            <div className="space-y-6">

              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-2 px-4 py-3 rounded-xl 
                             border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-[#1f2937]
                             text-gray-900 dark:text-gray-100
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500
                             transition-all duration-200"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="w-full mt-2 px-4 py-3 rounded-xl 
                             bg-gray-100 dark:bg-[#1f2937]
                             border border-gray-200 dark:border-gray-700
                             text-gray-500 cursor-not-allowed"
                />
              </div>

              <Button
                variant="primary"
                onClick={handleUpdateProfile}
                loading={loading}
              >
                Save Changes
              </Button>

            </div>
          </div>

          {/* Security Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
            <div className="flex justify-between items-center mb-6">
              {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Security
              </h3> */}

              {!showPasswordSection && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordSection(true)}
                >
                  Change Password
                </Button>
              )}
            </div>

            {showPasswordSection && (
              <div className="space-y-5 bg-gray-50 dark:bg-[#1a2332] 
                              p-6 rounded-xl border border-gray-200 dark:border-gray-700">

                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl 
                             border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-[#1f2937]
                             text-gray-900 dark:text-gray-100
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <input
                  type="password"
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl 
                             border border-gray-300 dark:border-gray-600
                             bg-white dark:bg-[#1f2937]
                             text-gray-900 dark:text-gray-100
                             placeholder-gray-400 dark:placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="flex space-x-3">
                  <Button
                    variant="primary"
                    onClick={handleChangePassword}
                    loading={loading}
                  >
                    Update Password
                  </Button>

                  <Button
                    variant="ghost"
                    onClick={() => setShowPasswordSection(false)}
                  >
                    Cancel
                  </Button>
                </div>

              </div>
            )}
          </div>

          {/* Logout */}
          <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-end">
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
