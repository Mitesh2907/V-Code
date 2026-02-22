import mysql from "mysql2/promise";

let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = mysql.createPool({
        host: process.env.DB_HOST,   
        port: process.env.DB_PORT,   // 3306
        user: process.env.DB_USER,   // root
        password: process.env.DB_PASSWORD, 
        database: process.env.DB_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        connectTimeout: 10000, 
      });

      // hard test
      await pool.query("SELECT 1");
      console.log("✅ MySQL (XAMPP) Connected Successfully");
    }

    return pool;
  } catch (error) {
    console.error("❌ MySQL Connection Failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;
