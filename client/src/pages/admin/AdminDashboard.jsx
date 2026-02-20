// src/pages/admin/AdminDashboard.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DoorOpen, MessageSquare, Video, Activity } from 'lucide-react';
import StatCard from '../../components/admin/StatCard';
import AnalyticsChart from '../../components/admin/AnalyticsChart';
import ActivityFeed from '../../components/admin/ActivityFeed';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 12543,
    totalRooms: 342,
    totalMessages: 89234,
    activeRooms: 128,
  });

  const [chartData, setChartData] = useState([
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 5000 },
    { name: 'Thu', value: 4500 },
    { name: 'Fri', value: 6000 },
    { name: 'Sat', value: 5500 },
    { name: 'Sun', value: 7000 },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <div className="flex items-center gap-3">
          <select className="bg-gray-900 border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-300 focus:outline-none focus:border-indigo-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={Users}
          change={12.5}
          changeType="positive"
          color="indigo"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={DoorOpen}
          change={8.2}
          changeType="positive"
          color="emerald"
        />
        <StatCard
          title="Total Messages"
          value={stats.totalMessages.toLocaleString()}
          icon={MessageSquare}
          change={23.1}
          changeType="positive"
          color="amber"
        />
        <StatCard
          title="Active Rooms"
          value={stats.activeRooms}
          icon={Video}
          change={5.7}
          changeType="positive"
          color="rose"
        />
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AnalyticsChart data={chartData} title="Platform Activity" />
        </div>
        <div className="lg:col-span-1">
          <ActivityFeed />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Activity className="text-indigo-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Users</p>
              <h4 className="text-2xl font-bold text-white">2,342</h4>
              <p className="text-xs text-emerald-400 mt-1">↑ 12% from yesterday</p>
            </div>
          </div>
        </motion.div>

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
              <h4 className="text-2xl font-bold text-white">5,678</h4>
              <p className="text-xs text-emerald-400 mt-1">↑ 8% from yesterday</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-xl">
              <Video className="text-amber-400" size={24} />
            </div>
            <div>
              <p className="text-sm text-gray-400">Active Calls</p>
              <h4 className="text-2xl font-bold text-white">42</h4>
              <p className="text-xs text-amber-400 mt-1">↑ 3 from last hour</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;