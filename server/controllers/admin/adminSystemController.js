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

    const [messages] = await pool.query(
      "SELECT COUNT(*) as total FROM messages"
    );

    // 🔥 Messages Today
    const [messagesToday] = await pool.query(
      "SELECT COUNT(*) as total FROM messages WHERE DATE(created_at) = CURDATE()"
    );

    // 🔥 Active Users (Last 24 Hours)
    // ⚠ Requires last_login column in users table
    const [activeUsers] = await pool.query(
      "SELECT COUNT(*) as total FROM users WHERE last_login >= NOW() - INTERVAL 1 DAY"
    );

    // 🔥 Last 7 Days Messages (Including 0 days)
const [weeklyMessages] = await pool.query(`
  SELECT 
    DATE(created_at) as date,
    COUNT(*) as total
  FROM messages
  WHERE created_at >= CURDATE() - INTERVAL 6 DAY
  GROUP BY DATE(created_at)
  ORDER BY DATE(created_at)
`);

// =========================
// 📈 FORMAT CHART DATA (Fill missing days)
// =========================

const last7Days = [];

for (let i = 6; i >= 0; i--) {
  const d = new Date();
  d.setDate(d.getDate() - i);

  const dateStr = d.toISOString().split("T")[0];

  const found = weeklyMessages.find(row =>
    row.date.toISOString().split("T")[0] === dateStr
  );

  last7Days.push({
    name: dateStr,
    value: found ? found.total : 0,
  });
}

    // =========================
    // 📈 FORMAT CHART DATA
    // =========================
    const chartData = weeklyMessages.map(row => ({
      name: row.date.toISOString().split("T")[0],
      value: row.total
    }));

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

    const rxBytes = networkStats[0]?.rx_sec || 0;
    const txBytes = networkStats[0]?.tx_sec || 0;

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
        totalUsers: users[0]?.total || 0,
        totalRooms: rooms[0]?.total || 0,
        totalMessages: messages[0]?.total || 0,
        activeRooms: activeRooms[0]?.total || 0,
        closedRooms: closedRooms[0]?.total || 0,
        activeUsers: activeUsers[0]?.total || 0,
        messagesToday: messagesToday[0]?.total || 0,
      },
      chartData: last7Days,
    });

  } catch (error) {
    console.error("Admin System Error:", error);
    res.status(500).json({
      message: "Failed to load system overview",
    });
  }
};