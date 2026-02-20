import os from "os";
import si from "systeminformation";
import connectDB from "../../config/db.js";

// 🔥 Better CPU calculation (Windows compatible)
const getCpuUsage = () => {
  const cpus = os.cpus();

  let idle = 0;
  let total = 0;

  cpus.forEach((core) => {
    for (let type in core.times) {
      total += core.times[type];
    }
    idle += core.times.idle;
  });

  const idleAvg = idle / cpus.length;
  const totalAvg = total / cpus.length;

  const usage = 100 - Math.floor((idleAvg / totalAvg) * 100);

  return usage;
};

export const getSystemOverview = async (req, res) => {
  try {
    const pool = await connectDB();

    // =========================
    // 📊 DATABASE STATS
    // =========================
    const [users] = await pool.query(
      "SELECT COUNT(*) as total FROM users"
    );
    const [rooms] = await pool.query(
      "SELECT COUNT(*) as total FROM rooms"
    );
    const [activeRooms] = await pool.query(
      "SELECT COUNT(*) as total FROM rooms WHERE status = 'active'"
    );
    const [closedRooms] = await pool.query(
      "SELECT COUNT(*) as total FROM rooms WHERE status = 'closed'"
    );

    // =========================
    // 🖥 CPU & MEMORY
    // =========================
    const cpuUsage = getCpuUsage();

    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const memoryUsage = Math.floor(
      ((totalMem - freeMem) / totalMem) * 100
    );

    // =========================
    // 🌐 NETWORK (REAL-TIME)
    // =========================
    const networkStats = await si.networkStats();

    const rxBytes = networkStats[0]?.rx_sec || 0; // received per sec
    const txBytes = networkStats[0]?.tx_sec || 0; // transmitted per sec

    const totalBytesPerSec = rxBytes + txBytes;

    const networkMbps = (
      totalBytesPerSec / 1024 / 1024
    ).toFixed(2);

    // =========================
    // 📤 RESPONSE
    // =========================
    res.json({
      metrics: {
        cpu: cpuUsage,
        memory: memoryUsage,
        network: `${networkMbps} MB/s`,
        securityScore: "A+",
      },
      stats: {
        totalUsers: users[0].total,
        totalRooms: rooms[0].total,
        activeRooms: activeRooms[0].total,
        closedRooms: closedRooms[0].total,
      },
      logs: [
        {
          id: 1,
          type: "info",
          message: "System running smoothly",
          time: "Just now",
        },
        {
          id: 2,
          type: "info",
          message: `Network activity: ${networkMbps} MB/s`,
          time: "Live",
        },
      ],
    });

  } catch (error) {
    console.error("Admin System Error:", error);
    res.status(500).json({
      message: "Failed to load system overview",
    });
  }
};
