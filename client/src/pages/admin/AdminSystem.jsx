import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  Clock,
  Server,
  Database,
  Wifi,
  Shield,
} from "lucide-react";
import api from "../../configs/api";

const AdminSystem = () => {
  const [systemData, setSystemData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSystem = async () => {
      try {
        const { data } = await api.get("/admin/system");
        setSystemData(data);
      } catch (error) {
        console.error("Failed to load system data");
      } finally {
        setLoading(false);
      }
    };

    fetchSystem();
  }, []);

  if (loading) {
    return (
      <div className="text-white text-lg p-6">
        Loading system data...
      </div>
    );
  }

  if (!systemData) {
    return (
      <div className="text-red-400 text-lg p-6">
        Failed to load system overview.
      </div>
    );
  }

  const metrics = [
    {
      label: "CPU Usage",
      value: `${systemData.metrics.cpu}%`,
      icon: Server,
      color: "indigo",
      progress: systemData.metrics.cpu,
    },
    {
      label: "Memory Usage",
      value: `${systemData.metrics.memory}%`,
      icon: Database,
      color: "emerald",
      progress: systemData.metrics.memory,
    },
    {
      label: "Network",
      value: systemData.metrics.network,
      icon: Wifi,
      color: "amber",
      progress: 30,
    },
    {
      label: "Security Score",
      value: systemData.metrics.securityScore,
      icon: Shield,
      color: "rose",
      progress: 95,
    },
  ];

  const colors = {
    indigo: "from-indigo-500 to-purple-600",
    emerald: "from-emerald-500 to-teal-600",
    amber: "from-amber-500 to-orange-600",
    rose: "from-rose-500 to-pink-600",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">
        System Overview
      </h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 bg-gradient-to-br ${colors[metric.color]} rounded-xl`}
                >
                  <Icon size={24} className="text-white" />
                </div>
                <span className="text-2xl font-bold text-white">
                  {metric.value}
                </span>
              </div>

              <p className="text-sm text-gray-400 mb-2">
                {metric.label}
              </p>

              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${metric.progress}%` }}
                  transition={{ duration: 1 }}
                  className={`h-full bg-gradient-to-r ${colors[metric.color]}`}
                />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* System Stats */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">
          Database Stats
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white">
          <div>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-xl font-bold">
              {systemData.stats.totalUsers}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Total Rooms</p>
            <p className="text-xl font-bold">
              {systemData.stats.totalRooms}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Active Rooms</p>
            <p className="text-xl font-bold text-emerald-400">
              {systemData.stats.activeRooms}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-400">Closed Rooms</p>
            <p className="text-xl font-bold text-rose-400">
              {systemData.stats.closedRooms}
            </p>
          </div>
        </div>
      </div>

      {/* System Logs */}
      <div className="bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-white mb-6">
          System Logs
        </h3>

       <div className="space-y-3">

  {/* Empty State */}
  {(!systemData.logs || systemData.logs.length === 0) && (
    <div className="p-4 bg-gray-800/30 rounded-lg text-center">
      <p className="text-sm text-gray-500">
        No system logs available
      </p>
    </div>
  )}

  {/* Logs List */}
  {(systemData.logs || []).map((log) => (
    <motion.div
      key={log.id}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-start gap-3 p-3 bg-gray-800/30 rounded-lg"
    >
      {/* Icon */}
      {log.type === "error" && (
        <AlertTriangle
          size={16}
          className="text-rose-400 mt-0.5"
        />
      )}

      {log.type === "warning" && (
        <AlertTriangle
          size={16}
          className="text-amber-400 mt-0.5"
        />
      )}

      {log.type === "info" && (
        <Activity
          size={16}
          className="text-indigo-400 mt-0.5"
        />
      )}

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-gray-300">
          {log.message || "No message"}
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {log.time || "Unknown time"}
        </p>
      </div>

      <Clock size={14} className="text-gray-600" />
    </motion.div>
  ))}

</div>
      </div>
    </div>
  );
};

export default AdminSystem;
