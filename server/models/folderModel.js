import connectDB from "../config/db.js";

/**
 * Create a new folder
 * parentId = null → root folder
 */
export const createFolderDB = async ({
  roomId,
  name,
  parentId = null,
}) => {
  const pool = await connectDB();

  const [result] = await pool.query(
    `INSERT INTO folders (room_id, name, parent_id)
     VALUES (?, ?, ?)`,
    [roomId, name, parentId]
  );

  return result.insertId; // new folder id
};

/**
 * Get all folders of a room
 */
export const getFoldersByRoomDB = async (roomId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE room_id = ?
     ORDER BY created_at ASC`,
    [roomId]
  );

  return rows;
};

/**
 * Get single folder by ID
 */
export const getFolderByIdDB = async (folderId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id, room_id, name, parent_id
     FROM folders
     WHERE id = ?
     LIMIT 1`,
    [folderId]
  );

  return rows[0]; // undefined if not found
};
