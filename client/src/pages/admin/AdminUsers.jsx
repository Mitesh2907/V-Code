import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Ban, Trash2, Eye } from "lucide-react";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import api from "../../configs/api";
import { useAuth } from "../../contexts/AuthContext";

const AdminUsers = () => {
  const { user } = useAuth(); // ✅ current logged-in user

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState(null);

  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  /* ===============================
     FETCH USERS
  ================================ */
  const fetchUsers = async () => {
    try {
      const { data } = await api.get(
        `/admin/users?page=${currentPage}&search=${searchTerm}`
      );

      setUsers(data.users);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  /* ===============================
     TOGGLE BLOCK / UNBLOCK
  ================================ */
  const handleToggleUser = async (userId) => {
    try {
      await api.put(`/admin/users/toggle/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Toggle error:", error);
    }
  };

  /* ===============================
     DELETE USER
  ================================ */
  const handleDeleteUser = async (userId) => {
    try {
      await api.delete(`/admin/users/${userId}`);
      fetchUsers();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  /* ===============================
     EFFECT
  ================================ */
  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">User Management</h1>
      </div>

      {/* SEARCH */}
      <div className="flex">
        <div className="relative w-full">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  User
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Role
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Status
                </th>
                <th className="text-left p-4 text-sm font-medium text-gray-400">
                  Joined
                </th>
                <th className="text-right p-4 text-sm font-medium text-gray-400">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <AnimatePresence>
                {users.map((u, index) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                  >
                    {/* USER INFO */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold">
                          {u.full_name?.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">
                            {u.full_name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {u.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* ROLE */}
                    <td className="p-4">
                      <StatusBadge status={u.role} />
                    </td>

                    {/* STATUS */}
                    <td className="p-4">
                      <StatusBadge status={u.status} />
                    </td>

                    {/* JOIN DATE */}
                    <td className="p-4">
                      <span className="text-sm text-gray-400">
                        {new Date(u.created_at).toLocaleDateString()}
                      </span>
                    </td>

                    {/* ACTIONS */}
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        {/* VIEW */}
                        <button
                          onClick={() => setSelectedUser(u)}
                          className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                          <Eye size={16} />
                        </button>

                        {/* TOGGLE BLOCK (hide for admin & self) */}
                        {u.role !== "admin" && u.id !== user?.id && (
                          <button
                            onClick={() => handleToggleUser(u.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 transition-colors"
                          >
                            <Ban
                              size={16}
                              className={
                                u.status === "blocked"
                                  ? "text-green-400"
                                  : "hover:text-yellow-400"
                              }
                            />
                          </button>
                        )}

                        {/* DELETE (hide for admin & self) */}
                        {u.role !== "admin" && u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id)}
                            className="p-2 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {users.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center p-6 text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="p-4 border-t border-gray-800">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {/* VIEW MODAL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-96">
            <h2 className="text-xl font-bold text-white mb-4">
              User Details
            </h2>

            <p className="text-gray-300 mb-2">
              <strong>Name:</strong> {selectedUser.full_name}
            </p>

            <p className="text-gray-300 mb-2">
              <strong>Email:</strong> {selectedUser.email}
            </p>

            <p className="text-gray-300 mb-2">
              <strong>Role:</strong> {selectedUser.role}
            </p>

            <p className="text-gray-300 mb-4">
              <strong>Status:</strong> {selectedUser.status}
            </p>

            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 px-4 py-2 bg-indigo-600 rounded-lg text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
