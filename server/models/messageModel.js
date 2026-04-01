import connectDB from "../config/db.js";

// CREATE MESSAGE
export const createMessageDB = async ({ roomId, userId, message }) => {
  const db = await connectDB();

  const result = await db.query(
    `
    INSERT INTO messages (room_id, user_id, message)
    VALUES ($1, $2, $3)
    RETURNING id
    `,
    [roomId, userId, message]
  );

  return result.rows[0].id;
};

// GET ROOM MESSAGES
export const getMessagesByRoomDB = async (roomId) => {
  const db = await connectDB();

  const result = await db.query(
    `
    SELECT 
      m.id,
      m.message,
      m.created_at,
      u.id AS user_id,
      u."fullName"
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.room_id = $1
    ORDER BY m.created_at ASC
    `,
    [roomId]
  );

  return result.rows;
};