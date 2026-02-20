import connectDB from "../../config/db.js";


/* ===============================
   GET ALL ROOMS
================================ */
export const getAllRooms = async (req, res) => {
  try {
    const pool = await connectDB();

    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "all";

    let whereConditions = [];
    let queryParams = [];

    // 🔍 Search filter
    if (search) {
      whereConditions.push(
        "(r.room_name LIKE ? OR u.fullName LIKE ?)"
      );
      queryParams.push(`%${search}%`, `%${search}%`);
    }

    // 🔥 Status filter
    if (status !== "all") {
      whereConditions.push("r.status = ?");
      queryParams.push(status);
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";

    // Main query
    const [rooms] = await pool.query(
      `
      SELECT 
        r.id,
        r.room_number,
        r.room_name,
        r.status,
        r.created_at,
        u.fullName AS creator_name,
        COUNT(rm.user_id) AS members
      FROM rooms r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN room_members rm ON rm.room_id = r.id
      ${whereClause}
      GROUP BY r.id
      ORDER BY r.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [...queryParams, limit, offset]
    );

    // Count query
    const [[{ total }]] = await pool.query(
      `
      SELECT COUNT(*) as total
      FROM rooms r
      LEFT JOIN users u ON r.created_by = u.id
      ${whereClause}
      `,
      queryParams
    );

    res.json({
      rooms,
      total,
      totalPages: Math.ceil(total / limit),
      page,
    });

  } catch (error) {
    console.error("Get Rooms Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



/* ==========================================
   TOGGLE ROOM STATUS (active ↔ closed)
========================================== */
export const toggleRoomStatus = async (req, res) => {
  try {
    const pool = await connectDB();
    const { id } = req.params;

    const [rooms] = await pool.query(
      "SELECT status FROM rooms WHERE id = ?",
      [id]
    );

    if (!rooms.length) {
      return res.status(404).json({ message: "Room not found" });
    }

    const currentStatus = rooms[0].status;
    const newStatus = currentStatus === "active" ? "closed" : "active";

    await pool.query(
      "UPDATE rooms SET status = ? WHERE id = ?",
      [newStatus, id]
    );

    res.json({
      message: `Room ${newStatus === "closed" ? "closed" : "reopened"} successfully`,
      status: newStatus
    });

  } catch (error) {
    console.error("Toggle Room Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


/* ==========================================
   DELETE ROOM
========================================== */
export const deleteRoom = async (req, res) => {
  try {
    const pool = await connectDB();
    const { id } = req.params;

    await pool.query("DELETE FROM rooms WHERE id = ?", [id]);

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    console.error("Delete Room Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
