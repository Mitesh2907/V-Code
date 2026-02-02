import connectDB from "../config/db.js";

/**
 * Create a new file
 * folderId = null → root file
 */
export const createFileDB = async ({
  roomId,
  folderId = null,
  name,
  language,
}) => {
  const pool = await connectDB();

  const [result] = await pool.query(
    `INSERT INTO files (room_id, folder_id, name, language)
     VALUES (?, ?, ?, ?)`,
    [roomId, folderId, name, language]
  );

  return result.insertId; // new file id
};

/**
 * Get all files of a room
 */
export const getFilesByRoomDB = async (roomId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id, room_id, folder_id, name, language, created_at
     FROM files
     WHERE room_id = ?
     ORDER BY created_at ASC`,
    [roomId]
  );

  return rows;
};

/**
 * Get single file by ID
 */
export const getFileByIdDB = async (fileId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT id, room_id, folder_id, name, language
     FROM files
     WHERE id = ?
     LIMIT 1`,
    [fileId]
  );

  return rows[0]; // undefined if not found
};
