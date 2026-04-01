import jwt from "jsonwebtoken";
import connectDB from "../config/db.js";

const authMiddleware = async (req, res, next) => {
  try {
    // 🔐 1. Get Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 🔑 2. Extract token
    const token = authHeader.split(" ")[1];

    // 🔍 3. Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🗄️ 4. Connect DB
    const db = await connectDB();

    // 🔥 5. Fetch user (PostgreSQL syntax FIXED)
    const result = await db.query(
      'SELECT id, "fullName", email, role, status FROM users WHERE id = $1',
      [decoded.userId]
    );

    // ❌ 6. User not found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // 🚫 7. Check if blocked
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Your account has been blocked by admin",
      });
    }

    // ✅ 8. Attach user to request
    req.user = user;
    req.userId = user.id;

    next();

  } catch (error) {
    console.error("❌ AUTH ERROR FULL:", error);  // 🔥 पूरा error दिखेगा

    return res.status(401).json({
      message: error.message,   // 🔥 actual reason frontend पर भी आएगा
    });
  }
};

export default authMiddleware;