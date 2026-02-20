import connectDB from "../config/db.js";

const adminMiddleware = async (req, res, next) => {
  try {
    const pool = await connectDB();

    const [rows] = await pool.query(
      "SELECT role FROM users WHERE id = ?",
      [req.userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (rows[0].role !== "admin") {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    console.error("Admin middleware error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export default adminMiddleware;
