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
  const db = await connectDB();

  const result = await db.query(
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
  const db = await connectDB();

  const result = await db.query(
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
  const db = await connectDB();

  const result = await db.query(
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
  const db = await connectDB();

  await db.query(
    `UPDATE folders SET name = $1 WHERE id = $2`,
    [newName, folderId]
  );
};

/**
 * Delete folder recursively (subfolders + files)
 */
export const deleteFolderRecursiveDB = async (folderId) => {
  const db = await connectDB();

  // 1️⃣ delete files inside folder
  await db.query(
    `DELETE FROM files WHERE folder_id = $1`,
    [folderId]
  );

  // 2️⃣ get child folders
  const result = await db.query(
    `SELECT id FROM folders WHERE parent_id = $1`,
    [folderId]
  );

  // 3️⃣ recursive delete
  for (const child of result.rows) {
    await deleteFolderRecursiveDB(child.id);
  }

  // 4️⃣ delete folder itself
  await db.query(
    `DELETE FROM folders WHERE id = $1`,
    [folderId]
  );
};