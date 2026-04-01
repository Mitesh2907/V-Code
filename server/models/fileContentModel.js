import connectDB from "../config/db.js";

/**
 * Create empty content when file is created
 */
export const createFileContentDB = async (fileId) => {
  const db = await connectDB();

  await db.query(
    `INSERT INTO file_contents (file_id, content)
     VALUES ($1, $2)`,
    [fileId, ""]
  );
};

/**
 * Update / Save file content
 */
export const saveFileContentDB = async (fileId, content) => {
  const db = await connectDB();

  await db.query(
    `UPDATE file_contents
     SET content = $1
     WHERE file_id = $2`,
    [content, fileId]
  );
};

/**
 * Get file content by file ID
 */
export const getFileContentByFileIdDB = async (fileId) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT content, updated_at
     FROM file_contents
     WHERE file_id = $1
     LIMIT 1`,
    [fileId]
  );

  return result.rows[0];
};