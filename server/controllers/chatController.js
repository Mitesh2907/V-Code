import connectDB from "../config/db.js";
import {
  createMessageDB,
  getMessagesByRoomDB,
} from "../models/messageModel.js";

export const saveMessage = async ({ roomId, user, text }) => {
  if (!roomId || !user || !text) return;

  await createMessageDB({
    roomId,
    userId: user.id || user.userId,
    message: text,
  });
};

export const getRoomMessages = async (req, res) => {
  try {
    const { roomId } = req.params;

    const messages = await getMessagesByRoomDB(roomId);

    res.json({ messages });
  } catch (err) {
  console.error("❌ getRoomMessages error:", err.message);
  res.status(500).json({ message: "Failed to load messages" });
}

};

export const getUnreadCount = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const db = await connectDB();

    const result = await db.query(
      `SELECT COUNT(*) AS unread_count
       FROM messages
       WHERE room_id = $1
       AND is_seen = FALSE
       AND user_id != $2`,
      [roomId, userId]
    );

    res.json({ unreadCount: result.rows[0].unread_count });

  } catch (err) {
    console.error("Unread count error:", err.message);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

export const markMessagesSeen = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const db = await connectDB();

    await db.query(
      `UPDATE messages
       SET is_seen = TRUE
       WHERE room_id = $1
       AND user_id != $2
       AND is_seen = FALSE`,
      [roomId, userId]
    );

    res.json({ message: "Messages marked as seen" });

  } catch (err) {
    console.error("Mark seen error:", err.message);
    res.status(500).json({ message: "Failed to mark seen" });
  }
};