const videoSocket = (io, socket) => {

  console.log("🎥 Video socket connected:", socket.id);

  /* ---------------- JOIN ROOM ---------------- */
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(roomId);

    console.log(`User ${socket.id} joined video room ${roomId}`);

    // 🔥 Notify others
    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
    });
  });

  /* ---------------- LEAVE ROOM ---------------- */
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    console.log(`User ${socket.id} left video room ${roomId}`);

    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });
  });

  /* ---------------- OFFER ---------------- */
  socket.on("video-offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("video-offer", {
      offer,
      sender: socket.id,
    });
  });

  /* ---------------- ANSWER ---------------- */
  socket.on("video-answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("video-answer", {
      answer,
      sender: socket.id,
    });
  });

  /* ---------------- ICE CANDIDATE ---------------- */
  socket.on("video-ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("video-ice-candidate", {
      candidate,
      sender: socket.id,
    });
  });

  /* ---------------- DISCONNECT ---------------- */
  socket.on("disconnect", () => {
    console.log("🎥 Video socket disconnected:", socket.id);
  });

};

export default videoSocket;
