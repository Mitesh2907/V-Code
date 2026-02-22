import connectDB from "../../config/db.js";

export const getAdminProfile = async (req, res) => {
  try {
    const pool = await connectDB();

    const [rows] = await pool.query(
      "SELECT id, fullName, email, role FROM users WHERE id = ? AND role = 'admin'",
      [req.userId]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ admin });

  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updateAdminProfile = async (req, res) => {
  try {
    const { fullName } = req.body;

    const pool = await connectDB();

    await pool.query(
      "UPDATE users SET fullName = ? WHERE id = ? AND role = 'admin'",
      [fullName, req.userId]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};