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
      u.full_name
    FROM messages m
    JOIN users u ON m.user_id = u.id
    WHERE m.room_id = $1
    ORDER BY m.created_at ASC
    `,
    [roomId]
  );

  return result.rows;
};


/**
 * GET UNREAD COUNT
 */
export const getUnreadCountDB = async (roomId, userId) => {
  const db = await connectDB();

  const result = await db.query(
    `SELECT COUNT(*) AS unread_count
     FROM messages
     WHERE room_id = $1
     AND is_seen = FALSE
     AND user_id != $2`,
    [roomId, userId]
  );

  return Number(result.rows[0].unread_count);
};

/**
 * MARK MESSAGES AS SEEN
 */
export const markMessagesSeenDB = async (roomId, userId) => {
  const db = await connectDB();

  await db.query(
    `UPDATE messages
     SET is_seen = TRUE
     WHERE room_id = $1
     AND user_id != $2
     AND is_seen = FALSE`,
    [roomId, userId]
  );
};