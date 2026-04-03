const activeCalls = new Set(); // 🔥 track active calls

const videoSocket = (io, socket) => {
  console.log("🎥 Video socket connected:", socket.id);

  /* ---------------- JOIN ROOM (GENERAL) ---------------- */
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

    // 🔥 agar call already chal rahi hai
    if (activeCalls.has(roomId)) {
      socket.emit("call-started");
    }
  });

  /* ---------------- VIDEO JOIN ---------------- */
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(roomId);

    // 🔥 mark call active
    activeCalls.add(roomId);

    // 🔥 notify others for WebRTC
    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
    });

    // 🔥 notify all users UI update
    io.to(roomId).emit("call-started");
  });

  /* ---------------- LEAVE ROOM ---------------- */
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });

    const room = io.sockets.adapter.rooms.get(roomId);

    // 🔥 agar room me koi nahi bacha
    if (!room || room.size === 0) {
      activeCalls.delete(roomId);
      io.to(roomId).emit("call-ended");
    }
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

    socket.broadcast.emit("video-user-left", {
      socketId: socket.id,
    });
  });
};

export default videoSocket;