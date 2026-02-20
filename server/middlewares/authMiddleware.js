import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const pool = await connectDB();

    // 🔥 Check user status from DB
    const [rows] = await pool.query(
      "SELECT status FROM users WHERE id = ?",
      [decoded.userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    if (rows[0].status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token invalid" });
  }
};

export default authMiddleware;
