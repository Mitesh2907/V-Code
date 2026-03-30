import connectDB from "../config/db.js";

// CREATE MESSAGE
export const createMessageDB = async ({ roomId, userId, message }) => {
  const db = await connectDB();

  const [result] = await db.query(
    `
    INSERT INTO messages (room_id, user_id, message)
    VALUES (?, ?, ?)
    `,
    [roomId, userId, message]
  );

  return result.insertId;
};

// GET ROOM MESSAGES
export const getMessagesByRoomDB = async (roomId) => {
  const db = await connectDB();

  const [rows] = await db.query(
    `
    SELECT 
      m.id,
      m.message,
      m.created_at,
      u.id AS user_id,
      u.fullName
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.room_id = ?
    ORDER BY m.created_at ASC
    `,
    [roomId]
  );

  return rows;
};
