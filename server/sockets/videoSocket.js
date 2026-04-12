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
  socket.on("video-join-room", ({ roomId, name }) => {
    socket.join(roomId);

    // 🔥 STORE USER NAME
    socket.name = name;

    activeCalls.add(roomId);

    // 🔥 GET ALL USERS IN ROOM
    const clients = Array.from(
      io.sockets.adapter.rooms.get(roomId) || []
    );

    // 🔥 SEND EXISTING USERS WITH NAME
    socket.emit(
      "existing-users",
      clients
        .filter((id) => id !== socket.id)
        .map((id) => ({
          socketId: id,
          name: io.sockets.sockets.get(id)?.name || "User",
        }))
    );

    // 🔥 NOTIFY OTHERS WITH NAME
    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
      name: socket.name,
    });

    io.to(roomId).emit("call-started");
  });

  /* ---------------- LEAVE ROOM ---------------- */
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    // 🔥 notify others user left
    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });

    const room = io.sockets.adapter.rooms.get(roomId);

    // 🔥 ONLY CLEANUP
    if (!room || room.size === 0) {
      activeCalls.delete(roomId);
    }
  });

  /* ---------------- CALL ENDED ---------------- */
  socket.on("call-ended", ({ roomId }) => {
    console.log("📴 Call ended in room:", roomId);

    // 🔥 send to ALL users
    io.to(roomId).emit("call-ended");

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

    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("video-user-left", {
        socketId: socket.id,
      });
    });
  });
};

export default videoSocket;