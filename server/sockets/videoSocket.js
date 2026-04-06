const activeCalls = new Set();

const videoSocket = (io, socket) => {
  console.log("🎥 Video socket connected:", socket.id);

  /* ---------------- JOIN ROOM (GENERAL) ---------------- */
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

    if (activeCalls.has(roomId)) {
      socket.emit("call-started");
    }
  });

  /* ---------------- VIDEO JOIN ---------------- */
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(roomId);

    activeCalls.add(roomId);

    // 🔥 GET ALL USERS IN ROOM
    const clients = Array.from(
      io.sockets.adapter.rooms.get(roomId) || []
    );

    // 🔥 SEND EXISTING USERS TO NEW USER
    socket.emit(
      "existing-users",
      clients.filter((id) => id !== socket.id)
    );

    // 🔥 NOTIFY OTHERS
    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
    });

    io.to(roomId).emit("call-started");
  });

  /* ---------------- LEAVE ROOM ---------------- */
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });

    const room = io.sockets.adapter.rooms.get(roomId);

    // 🔥 if room empty → end call
    if (!room || room.size === 0) {
      activeCalls.delete(roomId);
      io.to(roomId).emit("call-ended");
    }
  });

  /* ---------------- 🔥 CALL ENDED FIX ---------------- */
  socket.on("call-ended", ({ roomId }) => {
    console.log("📴 Call ended in room:", roomId);

    // 🔥 notify all other users
    socket.to(roomId).emit("call-ended");

    // 🔥 remove active call
    activeCalls.delete(roomId);
  });

  /* ---------------- OFFER ---------------- */
  socket.on("video-offer", ({ offer, to }) => {
    io.to(to).emit("video-offer", {
      offer,
      sender: socket.id,
    });
  });

  /* ---------------- ANSWER ---------------- */
  socket.on("video-answer", ({ answer, to }) => {
    io.to(to).emit("video-answer", {
      answer,
      sender: socket.id,
    });
  });

  /* ---------------- ICE ---------------- */
  socket.on("video-ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("video-ice-candidate", {
      candidate,
      sender: socket.id,
    });
  });

  /* ---------------- DISCONNECT ---------------- */
  socket.on("disconnect", () => {
    console.log("❌ Disconnected:", socket.id);

    // 🔥 notify only rooms this socket was part of
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("video-user-left", {
        socketId: socket.id,
      });
    });
  });
};

export default videoSocket;