import connectDB from "../config/db.js";

/**
 * Create a new folder
 */
export const createFolderDB = async ({
  roomId,
  name,
  parentId = null,
}) => {
  const pool = await connectDB();

  const result = await pool.query(
    `INSERT INTO folders (room_id, name, parent_id)
     VALUES ($1, $2, $3)
     RETURNING id`,
    [roomId, name, parentId]
  );

  return result.rows[0].id;
};

/**
 * Get all folders of a room
 */
export const getFoldersByRoomDB = async (roomId) => {
  const pool = await connectDB();

  const result = await pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE room_id = $1
     ORDER BY created_at ASC`,
    [roomId]
  );

  return result.rows;
};

/**
 * Get single folder by ID
 */
export const getFolderByIdDB = async (folderId) => {
  const pool = await connectDB();

  const result = await pool.query(
    `SELECT id, room_id, name, parent_id
     FROM folders
     WHERE id = $1
     LIMIT 1`,
    [folderId]
  );

  return result.rows[0];
};

/**
 * Rename folder
 */
export const renameFolderDB = async (folderId, newName) => {
  const pool = await connectDB();

  await pool.query(
    `UPDATE folders SET name = $1 WHERE id = $2`,
    [newName, folderId]
  );
};

/**
 * Delete folder recursively
 */
export const deleteFolderRecursiveDB = async (folderId) => {
  const pool = await connectDB();

  // 1️⃣ delete files
  await pool.query(
    `DELETE FROM files WHERE folder_id = $1`,
    [folderId]
  );

  // 2️⃣ get child folders
  const result = await pool.query(
    `SELECT id FROM folders WHERE parent_id = $1`,
    [folderId]
  );

  const children = result.rows;

  // 3️⃣ recursive delete
  for (const child of children) {
    await deleteFolderRecursiveDB(child.id);
  }

  // 4️⃣ delete folder
  await pool.query(
    `DELETE FROM folders WHERE id = $1`,
    [folderId]
  );
};