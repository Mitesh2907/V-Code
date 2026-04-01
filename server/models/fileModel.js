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
  const db = await connectDB();

  const result = await db.query(
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
  const db = await connectDB();

  const result = await db.query(
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
  const db = await connectDB();

  const result = await db.query(
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
  const db = await connectDB();

  await db.query(
    `UPDATE files
     SET name = $1
     WHERE id = $2`,
    [newName, fileId]
  );
};

/**
 * Delete file (and its content)
 */
export const deleteFileDB = async (fileId) => {
  const db = await connectDB();

  // pehle content delete
  await db.query(
    `DELETE FROM file_contents
     WHERE file_id = $1`,
    [fileId]
  );

  // phir file delete
  await db.query(
    `DELETE FROM files
     WHERE id = $1`,
    [fileId]
  );
};

/**
 * Rename folder
 */
export const renameFolderDB = async (folderId, newName) => {
  const db = await connectDB();

  await db.query(
    `UPDATE folders
     SET name = $1
     WHERE id = $2`,
    [newName, folderId]
  );
};

/**
 * Delete folder and all its subfolders + files
 */
export const deleteFolderRecursiveDB = async (folderId) => {
  const db = await connectDB();

  // delete files inside this folder
  await db.query(
    `DELETE FROM files WHERE folder_id = $1`,
    [folderId]
  );

  // get child folders
  const result = await db.query(
    `SELECT id FROM folders WHERE parent_id = $1`,
    [folderId]
  );

  // recursive delete
  for (const child of result.rows) {
    await deleteFolderRecursiveDB(child.id);
  }

  // delete the folder itself
  await db.query(
    `DELETE FROM folders WHERE id = $1`,
    [folderId]
  );
};