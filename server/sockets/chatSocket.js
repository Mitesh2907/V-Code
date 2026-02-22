import { createMessageDB } from "../models/messageModel.js";

const chatSocket = (io, socket) => {

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });

  socket.on("send-message", async ({ roomId, message }) => {
    try {
      // message = { text, userId, user }

      await createMessageDB({
        roomId,
        userId: message.userId,
        message: message.text,
      });

      io.to(roomId).emit("receive-message", {
        user: message.user,
        text: message.text,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });

    } catch (err) {
      console.error("❌ Message save error:", err.message);
    }
  });
};

export default chatSocket;
