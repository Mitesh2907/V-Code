import connectDB from "../../config/db.js";

/* ===============================
   GET ALL ROOMS
================================ */
export const getAllRooms = async (req, res) => {
  try {
    const db = await connectDB();

    const page = parseInt(req.query.page) || 1;
    const limit = 6;
    const offset = (page - 1) * limit;

    const search = req.query.search || "";
    const status = req.query.status || "all";

    let whereConditions = [];
    let queryParams = [];
    let paramIndex = 1;

    // 🔍 Search filter
    if (search) {
      whereConditions.push(
        `(r.room_name ILIKE $${paramIndex} OR u."fullName" ILIKE $${paramIndex + 1})`
      );
      queryParams.push(`%${search}%`, `%${search}%`);
      paramIndex += 2;
    }

    // 🔥 Status filter
    if (status !== "all") {
      whereConditions.push(`r.status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    const whereClause =
      whereConditions.length > 0
        ? "WHERE " + whereConditions.join(" AND ")
        : "";

    // Main query
    const result = await db.query(
      `
      SELECT 
        r.id,
        r.room_number,
        r.room_name,
        r.status,
        r.created_at,
        u."fullName" AS creator_name,
        COUNT(rm.user_id) AS members
      FROM rooms r
      LEFT JOIN users u ON r.created_by = u.id
      LEFT JOIN room_members rm ON rm.room_id = r.id
      ${whereClause}
      GROUP BY r.id, u."fullName"
      ORDER BY r.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
      `,
      [...queryParams, limit, offset]
    );

    const rooms = result.rows;

    // Count query
    const countResult = await db.query(
      `
      SELECT COUNT(*) as total
      FROM rooms r
      LEFT JOIN users u ON r.created_by = u.id
      ${whereClause}
      `,
      queryParams
    );

    const total = parseInt(countResult.rows[0].total);

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
   TOGGLE ROOM STATUS
========================================== */
export const toggleRoomStatus = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    const result = await db.query(
      "SELECT status FROM rooms WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Room not found" });
    }

    const currentStatus = result.rows[0].status;
    const newStatus = currentStatus === "active" ? "closed" : "active";

    await db.query(
      "UPDATE rooms SET status = $1 WHERE id = $2",
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
    const db = await connectDB();
    const { id } = req.params;

    await db.query("DELETE FROM rooms WHERE id = $1", [id]);

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    console.error("Delete Room Error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};