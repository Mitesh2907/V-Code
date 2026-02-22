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

/**
 * Rename file
 */
export const renameFileDB = async (fileId, newName) => {
  const pool = await connectDB();

  await pool.query(
    `UPDATE files
     SET name = ?
     WHERE id = ?`,
    [newName, fileId]
  );
};

/**
 * Delete file (and its content)
 */
export const deleteFileDB = async (fileId) => {
  const pool = await connectDB();

  // pehle content delete
  await pool.query(
    `DELETE FROM file_contents
     WHERE file_id = ?`,
    [fileId]
  );

  // phir file delete
  await pool.query(
    `DELETE FROM files
     WHERE id = ?`,
    [fileId]
  );
};

/**
 * Rename folder
 */
export const renameFolderDB = async (folderId, newName) => {
  const pool = await connectDB();

  await pool.query(
    `UPDATE folders
     SET name = ?
     WHERE id = ?`,
    [newName, folderId]
  );
};

/**
 * Delete folder and all its subfolders + files
 */
export const deleteFolderRecursiveDB = async (folderId) => {
  const pool = await connectDB();

  // 🔥 delete files inside this folder
  await pool.query(
    `DELETE FROM files WHERE folder_id = ?`,
    [folderId]
  );

  // 🔥 get child folders
  const [childFolders] = await pool.query(
    `SELECT id FROM folders WHERE parent_id = ?`,
    [folderId]
  );

  // 🔁 recursive delete
  for (const child of childFolders) {
    await deleteFolderRecursiveDB(child.id);
  }

  // 🔥 delete the folder itself
  await pool.query(
    `DELETE FROM folders WHERE id = ?`,
    [folderId]
  );
};
