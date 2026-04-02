import os from "os";
import si from "systeminformation";
import connectDB from "../../config/db.js";

// 🔥 CPU calculation
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

  return 100 - Math.floor((idleAvg / totalAvg) * 100);
};

export const getSystemOverview = async (req, res) => {
  try {
    const db = await connectDB();

    // =========================
    // 📊 DATABASE STATS
    // =========================
    const usersRes = await db.query("SELECT COUNT(*) as total FROM users");
    const roomsRes = await db.query("SELECT COUNT(*) as total FROM rooms");
    const activeRoomsRes = await db.query(
      "SELECT COUNT(*) as total FROM rooms WHERE status = 'active'"
    );
    const closedRoomsRes = await db.query(
      "SELECT COUNT(*) as total FROM rooms WHERE status = 'closed'"
    );
    const messagesRes = await db.query(
      "SELECT COUNT(*) as total FROM messages"
    );

    // 🔥 Messages Today (PostgreSQL)
    const messagesTodayRes = await db.query(
      `SELECT COUNT(*) as total 
       FROM messages 
       WHERE DATE(created_at) = CURRENT_DATE`
    );

    // 🔥 Active Users (last 24h)
    const activeUsersRes = await db.query(
      `SELECT COUNT(*) as total 
       FROM users 
       WHERE last_login >= NOW() - INTERVAL '1 day'`
    );

    // 🔥 Weekly Messages (last 7 days)
    const weeklyMessagesRes = await db.query(`
      SELECT 
        DATE(created_at) as date,
        COUNT(*) as total
      FROM messages
      WHERE created_at >= CURRENT_DATE - INTERVAL '6 days'
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);

    const weeklyMessages = weeklyMessagesRes.rows;

    // =========================
    // 📈 FORMAT CHART DATA
    // =========================
    const last7Days = [];

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dateStr = d.toISOString().split("T")[0];

      const found = weeklyMessages.find(
        (row) =>
          new Date(row.date).toISOString().split("T")[0] === dateStr
      );

      last7Days.push({
        name: dateStr,
        value: found ? parseInt(found.total) : 0,
      });
    }

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
    // 🌐 NETWORK
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
        totalUsers: parseInt(usersRes.rows[0]?.total || 0),
        totalRooms: parseInt(roomsRes.rows[0]?.total || 0),
        totalMessages: parseInt(messagesRes.rows[0]?.total || 0),
        activeRooms: parseInt(activeRoomsRes.rows[0]?.total || 0),
        closedRooms: parseInt(closedRoomsRes.rows[0]?.total || 0),
        activeUsers: parseInt(activeUsersRes.rows[0]?.total || 0),
        messagesToday: parseInt(messagesTodayRes.rows[0]?.total || 0),
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