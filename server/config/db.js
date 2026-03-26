import pkg from 'pg';
const { Pool } = pkg;

let pool;

const connectDB = async () => {
  try {
    if (!pool) {
      pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: {
          rejectUnauthorized: false,
        },
      });

      await pool.query("SELECT 1");
      console.log("✅ PostgreSQL Connected Successfully");
    }

    return pool;
  } catch (error) {
    console.error("❌ PostgreSQL Connection Failed:", error.message);
    throw error;
  }
};

export default connectDB;