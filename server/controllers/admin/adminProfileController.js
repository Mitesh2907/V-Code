import connectDB from "../../config/db.js";

export const getAdminProfile = async (req, res) => {
  try {
    const db = await connectDB();

    const result = await db.query(
      `SELECT id, "fullName", email, role 
       FROM users 
       WHERE id = $1 AND role = 'admin'`,
      [req.userId]
    );

    const admin = result.rows[0];

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

    const db = await connectDB();

    await db.query(
      `UPDATE users 
       SET "fullName" = $1 
       WHERE id = $2 AND role = 'admin'`,
      [fullName, req.userId]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};