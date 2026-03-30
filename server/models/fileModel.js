import connectDB from "../config/db.js";

/**
 * Create a new file
 */
export const createFileDB = async ({
  roomId,
  folderId = null,
  name,
  language,
}) => {
  const pool = await connectDB();

  const result = await pool.query(
    `INSERT INTO files (room_id, folder_id, name, language)
     VALUES ($1, $2, $3, $4)
     RETURNING id`,
    [roomId, folderId, name, language]
  );

  return result.rows[0].id;
};

/**
 * Get all files of a room
 */
export const getFilesByRoomDB = async (roomId) => {
  const pool = await connectDB();

  const result = await pool.query(
    `SELECT id, room_id, folder_id, name, language, created_at
     FROM files
     WHERE room_id = $1
     ORDER BY created_at ASC`,
    [roomId]
  );

  return result.rows;
};

/**
 * Get single file by ID
 */
export const getFileByIdDB = async (fileId) => {
  const pool = await connectDB();

  const result = await pool.query(
    `SELECT id, room_id, folder_id, name, language
     FROM files
     WHERE id = $1
     LIMIT 1`,
    [fileId]
  );

  return result.rows[0];
};

/**
 * Rename file
 */
export const renameFileDB = async (fileId, newName) => {
  const pool = await connectDB();

  await pool.query(
    `UPDATE files
     SET name = $1
     WHERE id = $2`,
    [newName, fileId]
  );
};

/**
 * Delete file
 */
export const deleteFileDB = async (fileId) => {
  const pool = await connectDB();

  // delete content
  await pool.query(
    `DELETE FROM file_contents
     WHERE file_id = $1`,
    [fileId]
  );

  // delete file
  await pool.query(
    `DELETE FROM files
     WHERE id = $1`,
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
     SET name = $1
     WHERE id = $2`,
    [newName, folderId]
  );
};

/**
 * Delete folder recursively
 */
export const deleteFolderRecursiveDB = async (folderId) => {
  const pool = await connectDB();

  // delete files
  await pool.query(
    `DELETE FROM files WHERE folder_id = $1`,
    [folderId]
  );

  // get child folders
  const result = await pool.query(
    `SELECT id FROM folders WHERE parent_id = $1`,
    [folderId]
  );

  const childFolders = result.rows;

  // recursive delete
  for (const child of childFolders) {
    await deleteFolderRecursiveDB(child.id);
  }

  // delete folder
  await pool.query(
    `DELETE FROM folders WHERE id = $1`,
    [folderId]
  );
};