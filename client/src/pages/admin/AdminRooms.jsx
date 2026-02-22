// src/pages/admin/AdminRooms.jsx
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Users,
  XCircle,
  Trash2,
  Eye,
  DoorOpen
} from "lucide-react";
import StatusBadge from "../../components/admin/StatusBadge";
import Pagination from "../../components/admin/Pagination";
import api from "../../configs/api";

const AdminRooms = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [rooms, setRooms] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  /* ===============================
     FETCH ROOMS
  ================================ */
  const fetchRooms = async () => {
    try {
      const { data } = await api.get(
        `/admin/rooms?page=${currentPage}&search=${searchTerm}&status=${filterStatus}`
      );

      setRooms(data.rooms);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching rooms:", error);
    }
  };

  /* ===============================
     TOGGLE ROOM STATUS
  ================================ */
  const handleToggleRoom = async (roomId) => {
    try {
      await api.put(`/admin/rooms/toggle/${roomId}`);
      fetchRooms();
    } catch (error) {
      console.error("Toggle room error:", error);
    }
  };

  /* ===============================
     DELETE ROOM
  ================================ */
  const handleDeleteRoom = async (roomId) => {
    try {
      await api.delete(`/admin/rooms/${roomId}`);
      fetchRooms();
    } catch (error) {
      console.error("Delete room error:", error);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [currentPage, searchTerm, filterStatus]);

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">
          Room Management
        </h1>
      </div>

      {/* SEARCH + FILTER */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            size={18}
          />
          <input
            type="text"
            placeholder="Search rooms by name or creator..."
            value={searchTerm}
            onChange={(e) => {
              setCurrentPage(1);
              setSearchTerm(e.target.value);
            }}
            className="w-full pl-10 pr-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
          />
        </div>

        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => {
            setCurrentPage(1);
            setFilterStatus(e.target.value);
          }}
          className="px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-lg text-sm text-gray-300 focus:outline-none focus:border-indigo-500/50"
        >
          <option value="all">All Rooms</option>
          <option value="active">Active Rooms</option>
          <option value="closed">Closed Rooms</option>
        </select>
      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {rooms.map((room, index) => (
            <motion.div
              key={room.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
            >
              {/* HEADER */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/20 rounded-xl">
                    <DoorOpen className="text-indigo-400" size={22} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {room.room_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      ID: {room.room_number}
                    </p>
                  </div>
                </div>
                <StatusBadge status={room.status} />
              </div>

              {/* INFO */}
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-white">
                    {room.creator_name}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Members</span>
                  <span className="text-white flex items-center gap-1">
                    <Users size={14} className="text-gray-500" />
                    {room.members}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-400">Created</span>
                  <span className="text-gray-300">
                    {new Date(room.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-2 border-t border-gray-800 pt-4">
                <button className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white">
                  <Eye size={16} />
                </button>

                <button
                  onClick={() => handleToggleRoom(room.id)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-yellow-400"
                >
                  <XCircle size={16} />
                </button>

                <button
                  onClick={() => handleDeleteRoom(room.id)}
                  className="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-red-400"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {rooms.length === 0 && (
          <div className="text-gray-500 col-span-full text-center py-8">
            No rooms found
          </div>
        )}
      </div>

      {/* PAGINATION */}
      <div className="flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default AdminRooms;
