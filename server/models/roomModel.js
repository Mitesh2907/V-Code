import connectDB from "../config/db.js";

/**
 * Create a new room
 */
export const createRoomDB = async ({
  roomNumber,
  roomName,
  hashedPassword,
  createdBy,
}) => {
  const pool = await connectDB();

  const [result] = await pool.query(
    `INSERT INTO rooms (room_number, room_name, password, created_by)
     VALUES (?, ?, ?, ?)`,
    [roomNumber, roomName, hashedPassword, createdBy]
  );

  return result.insertId; // room_id
};

/**
 * Find room by room number
 */
export const getRoomByNumberDB = async (roomNumber) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT * FROM rooms WHERE room_number = ?`,
    [roomNumber]
  );

  return rows[0]; // undefined if not found
};

/**
 * Add user as room member
 */
export const addRoomMemberDB = async (roomId, userId) => {
  const pool = await connectDB();

  const [result] = await pool.query(
    `INSERT IGNORE INTO room_members (room_id, user_id)
     VALUES (?, ?)`,
    [roomId, userId]
  );

  return result;
};

/**
 * Get rooms created by user
 */
export const getCreatedRoomsDB = async (userId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id, room_number, room_name, created_at
     FROM rooms
     WHERE created_by = ?
     ORDER BY created_at DESC`,
    [userId]
  );

  return rows;
};

/**
 * Get rooms joined by user
 */
export const getJoinedRoomsDB = async (userId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT r.id, r.room_number, r.room_name, r.created_at
     FROM rooms r
     INNER JOIN room_members rm ON r.id = rm.room_id
     WHERE rm.user_id = ?
     AND r.created_by != ?
     ORDER BY rm.joined_at DESC`,
    [userId, userId]
  );

  return rows;
};


/**
 * Check if user is a member of a room
 */
export const isUserRoomMemberDB = async (roomId, userId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id FROM room_members
     WHERE room_id = ? AND user_id = ?
     LIMIT 1`,
    [roomId, userId]
  );

  return rows.length > 0; // true or false
};

/**
 * Get room by room ID
 */
export const getRoomByIdDB = async (roomId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id, room_number, room_name, created_at
     FROM rooms
     WHERE id = ?
     LIMIT 1`,
    [roomId]
  );

  return rows[0]; // undefined if not found
};
