import connectDB from "../../config/db.js";

/* ===============================
   GET ALL USERS
================================ */
export const getAllUsers = async (req, res) => {
  try {
    const db = await connectDB();

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";

    // ✅ PostgreSQL FIX
    const result = await db.query(
      `SELECT id, "fullName", email, role, status, created_at
       FROM users
       WHERE "fullName" ILIKE $1 OR email ILIKE $2
       ORDER BY created_at DESC
       LIMIT $3 OFFSET $4`,
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    const users = result.rows;

    const countResult = await db.query(
      `SELECT COUNT(*) as total 
       FROM users
       WHERE "fullName" ILIKE $1 OR email ILIKE $2`,
      [`%${search}%`, `%${search}%`]
    );

    const total = parseInt(countResult.rows[0].total);

    res.json({
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("Get Users Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   BLOCK USER
================================ */
export const toggleBlockUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db.query(
      "SELECT role, status FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // ❌ Prevent blocking admin
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin cannot be blocked",
      });
    }

    const newStatus =
      user.status === "blocked" ? "active" : "blocked";

    await db.query(
      "UPDATE users SET status = $1 WHERE id = $2",
      [newStatus, id]
    );

    res.json({
      message: `User ${newStatus === "blocked" ? "blocked" : "unblocked"} successfully`,
    });

  } catch (error) {
    console.error("Toggle Block Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


/* ===============================
   DELETE USER
================================ */
export const deleteUser = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db.query(
      "SELECT role FROM users WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent deleting admin
    if (result.rows[0].role === "admin") {
      return res.status(403).json({
        message: "Admin cannot be deleted",
      });
    }

    await db.query("DELETE FROM users WHERE id = $1", [id]);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};