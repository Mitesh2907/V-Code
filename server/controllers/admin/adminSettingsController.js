import connectDB from "../../config/db.js";
import bcrypt from "bcryptjs";

export const changeAdminPassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const pool = await connectDB();

    const [rows] = await pool.query(
      "SELECT password FROM users WHERE id = ? AND role = 'admin'",
      [req.userId]
    );

    const admin = rows[0];

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, admin.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      "UPDATE users SET password = ? WHERE id = ?",
      [hashedPassword, req.userId]
    );

    res.json({ message: "Password updated successfully" });

  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};