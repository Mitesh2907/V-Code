import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DoorOpen, MessageSquare, Video, Activity } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import ActivityFeed from '../../components/admin/ActivityFeed';
import api from "../../configs/api";

const AdminDashboard = () => {

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalRooms: 0,
    totalMessages: 0,
    activeRooms: 0,
    activeUsers: 0,
    messagesToday: 0,
  });

  const [chartData, setChartData] = useState([]);

  useEffect(() => {
  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/system");

      setStats(data.stats || {});
      setChartData(data.chartData || []);

    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  fetchStats();
}, []);

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
      </div>

      {/* Top Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Users"
          value={(stats.totalUsers || 0).toLocaleString()}
          icon={Users}
          color="indigo"
        />

        <StatCard
          title="Total Rooms"
          value={(stats.totalRooms || 0).toLocaleString()}
          icon={DoorOpen}
          color="emerald"
        />

        <StatCard
          title="Total Messages"
          value={(stats.totalMessages || 0).toLocaleString()}
          icon={MessageSquare}
          color="amber"
        />

        <StatCard
          title="Active Rooms"
          value={(stats.activeRooms || 0).toLocaleString()}
          icon={DoorOpen}
          color="rose"
        />

      </div>

      {/* Chart + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart data={chartData} title="Last 7 Days Activity" />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Active Users */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users (24h)</p>
              <h4 className="text-2xl font-bold text-white">
                {(stats.activeUsers || 0).toLocaleString()}
              </h4>
            </div>
          </div>
        </motion.div>

        {/* Messages Today */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <MessageSquare className="text-emerald-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Messages Today</p>
              <h4 className="text-2xl font-bold text-white">
                {(stats.messagesToday || 0).toLocaleString()}
              </h4>
            </div>
          </div>
        </motion.div>

        {/* Active Rooms */}
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <DoorOpen className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Rooms</p>
              <h4 className="text-2xl font-bold text-white">
                {(stats.activeRooms || 0).toLocaleString()}
              </h4>
            </div>
          </div>
        </motion.div>

      </div>

    </div>
  );
};

export default AdminDashboard;