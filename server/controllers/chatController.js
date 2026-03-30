import {
  createMessageDB,
  getMessagesByRoomDB,
  getUnreadCountDB,
  markMessagesSeenDB,
} from "../models/messageModel.js";

/**
 * SAVE MESSAGE (socket use)
 */
export const saveMessage = async ({ roomId, user, text }) => {
  if (!roomId || !user || !text) {
    console.warn("Invalid message data");
    return;
  }

  await createMessageDB({
    roomId,
    userId: user.id || user.userId,
    message: text,
  });
};

/**
 * GET ROOM MESSAGES
 */
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

/**
 * GET UNREAD COUNT
 */
export const getUnreadCount = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    const unreadCount = await getUnreadCountDB(roomId, userId);

    res.json({ unreadCount });
  } catch (err) {
    console.error("Unread count error:", err.message);
    res.status(500).json({ message: "Failed to get unread count" });
  }
};

/**
 * MARK MESSAGES AS SEEN
 */
export const markMessagesSeen = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.userId;

    await markMessagesSeenDB(roomId, userId);

    res.json({ message: "Messages marked as seen" });
  } catch (err) {
    console.error("Mark seen error:", err.message);
    res.status(500).json({ message: "Failed to mark seen" });
  }
};