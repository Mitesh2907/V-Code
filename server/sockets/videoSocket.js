const activeCalls = new Set();

const videoSocket = (io, socket) => {
  console.log("🎥 Video socket connected:", socket.id);

  socket.on("video-join-room", ({ roomId, name }) => {
    socket.join(roomId);
    socket.userName = name || "User"; 
    socket.camOn = true; 
    activeCalls.add(roomId);

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    socket.emit("existing-users", clients.filter((id) => id !== socket.id).map((id) => {
      const clientSocket = io.sockets.sockets.get(id);
      return {
        socketId: id,
        name: clientSocket?.userName || "User",
        camOn: clientSocket?.camOn ?? true,
      };
    }));

    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
      name: socket.userName,
      camOn: true,
    });
  });

  socket.on("camera-toggle", ({ roomId, camOn }) => {
    socket.camOn = camOn;
    socket.to(roomId).emit("camera-toggle", { socketId: socket.id, camOn });
  });

  socket.on("video-offer", ({ offer, to }) => {
    io.to(to).emit("video-offer", { offer, sender: socket.id });
  });

  socket.on("video-answer", ({ answer, to }) => {
    io.to(to).emit("video-answer", { answer, sender: socket.id });
  });

  socket.on("video-ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("video-ice-candidate", { candidate, sender: socket.id });
  });

  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);
    socket.to(roomId).emit("video-user-left", { socketId: socket.id });
  });

  socket.on("disconnect", () => {
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("video-user-left", { socketId: socket.id });
    });
  });
};

export default videoSocket;