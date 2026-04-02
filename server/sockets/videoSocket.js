const videoSocket = (io, socket) => {

  console.log("🎥 Video socket connected:", socket.id);

  /* ---------------- JOIN ROOM ---------------- */
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(roomId);

    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
    });
  });

  /* ---------------- LEAVE ROOM ---------------- */
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });
  });

  /* ---------------- OFFER ---------------- */
  socket.on("video-offer", ({ offer, target }) => {
    io.to(target).emit("video-offer", {
      offer,
      sender: socket.id,
    });
  });

  /* ---------------- ANSWER ---------------- */
  socket.on("video-answer", ({ answer, target }) => {
    io.to(target).emit("video-answer", {
      answer,
      sender: socket.id,
    });
  });

  /* ---------------- ICE ---------------- */
  socket.on("video-ice-candidate", ({ candidate, target }) => {
    io.to(target).emit("video-ice-candidate", {
      candidate,
      sender: socket.id,
    });
  });

  /* ---------------- DISCONNECT ---------------- */
  socket.on("disconnect", () => {
    socket.broadcast.emit("video-user-left", {
      socketId: socket.id,
    });
  });

};

export default videoSocket;