import connectDB from "../../config/db.js";

/* ===============================
   GET ALL USERS
================================ */
export const getAllUsers = async (req, res) => {
  try {
    const pool = await connectDB();

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";

    const [users] = await pool.query(
      `SELECT id, fullName, email, role, status, created_at
       FROM users
       WHERE fullName LIKE ? OR email LIKE ?
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [`%${search}%`, `%${search}%`, limit, offset]
    );

    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) as total FROM users
       WHERE fullName LIKE ? OR email LIKE ?`,
      [`%${search}%`, `%${search}%`]
    );

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
    const pool = await connectDB();
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT role, status FROM users WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = rows[0];

    // ❌ Prevent blocking admin
    if (user.role === "admin") {
      return res.status(403).json({
        message: "Admin cannot be blocked",
      });
    }

    const newStatus =
      user.status === "blocked" ? "active" : "blocked";

    await pool.query(
      "UPDATE users SET status = ? WHERE id = ?",
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
    const pool = await connectDB();
    const { id } = req.params;

    const [rows] = await pool.query(
      "SELECT role FROM users WHERE id = ?",
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    // ❌ Prevent deleting admin
    if (rows[0].role === "admin") {
      return res.status(403).json({
        message: "Admin cannot be deleted",
      });
    }

    await pool.query("DELETE FROM users WHERE id = ?", [id]);

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    console.error("Delete User Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

