import mysql from "mysql2/promise";

let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),   // 🔥 important
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,

        ssl: {
          rejectUnauthorized: false,  // 🔥 Railway ke liye required
        },

        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 10000,
      });

      await pool.query("SELECT 1");
      console.log("✅ MySQL Connected Successfully");
    }

    return pool;
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    throw error;  // 🔥 process.exit remove karo (Vercel crash karta hai)
  }
};

export default connectDB;