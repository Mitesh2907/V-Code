import connectDB from "../config/db.js";

/**
 * Create empty content when file is created
 */
export const createFileContentDB = async (fileId) => {
  const pool = await connectDB();

  await pool.query(
    `INSERT INTO file_contents (file_id, content)
     VALUES (?, ?)`,
    [fileId, ""]
  );
};

/**
 * Update / Save file content
 */
export const saveFileContentDB = async (fileId, content) => {
  const pool = await connectDB();

  await pool.query(
    `UPDATE file_contents
     SET content = ?
     WHERE file_id = ?`,
    [content, fileId]
  );
};

/**
 * Get file content by file ID
 */
export const getFileContentByFileIdDB = async (fileId) => {
  const pool = await connectDB();

  const [rows] = await pool.query(
    `SELECT content, updated_at
     FROM file_contents
     WHERE file_id = ?
     LIMIT 1`,
    [fileId]
  );

  return rows[0]; // { content, updated_at }
};
