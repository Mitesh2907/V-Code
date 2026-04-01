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
  const db = await connectDB();

  const result = await db.query(
    `INSERT INTO rooms (room_number, room_name, password, created_by)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [roomNumber, roomName, hashedPassword, createdBy]
  );

  return result.rows[0].id;
};

/**
 * Find room by room number
 */
export const getRoomByNumberDB = async (roomNumber) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT * FROM rooms WHERE room_number = $1`,
    [roomNumber]
  );

  return result.rows[0];
};

/**
 * Add user as room member
 */
export const addRoomMemberDB = async (roomId, userId) => {
  const db = await connectDB();

  const result = await db.query(
    `INSERT INTO room_members (room_id, user_id)
     VALUES ($1, $2)
     ON CONFLICT DO NOTHING`,
    [roomId, userId]
  );

  return result;
};

/**
 * Get rooms created by user
 */
export const getCreatedRoomsDB = async (userId) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT id, room_number, room_name, status, created_at
     FROM rooms
     WHERE created_by = $1
     ORDER BY created_at DESC`,
    [userId]
  );

  return result.rows;
};

/**
 * Get rooms joined by user
 */
export const getJoinedRoomsDB = async (userId) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT r.id, r.room_number, r.room_name, r.status, r.created_at
     FROM rooms r
     INNER JOIN room_members rm ON r.id = rm.room_id
     WHERE rm.user_id = $1
     AND r.created_by != $2
     ORDER BY rm.joined_at DESC`,
    [userId, userId]
  );

  return result.rows;
};

/**
 * Check if user is a member of a room
 */
export const isUserRoomMemberDB = async (roomId, userId) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT id FROM room_members
     WHERE room_id = $1 AND user_id = $2
     LIMIT 1`,
    [roomId, userId]
  );

  return result.rows.length > 0;
};

/**
 * Get room by room ID
 */
export const getRoomByIdDB = async (roomId) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT id, room_number, room_name, status, created_at
     FROM rooms
     WHERE id = $1
     LIMIT 1`,
    [roomId]
  );

  return result.rows[0];
};