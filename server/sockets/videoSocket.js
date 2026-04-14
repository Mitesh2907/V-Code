const activeCalls = new Set();

const videoSocket = (io, socket) => {
  console.log("🎥 Video socket connected:", socket.id);

  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
    if (activeCalls.has(roomId)) socket.emit("call-started");
  });

  socket.on("video-join-room", ({ roomId, name }) => {
    socket.join(roomId);

    // 🔥 Sync Fix: Data ko server object par store karo
    socket.userName = name || "User"; 
    socket.camOn = true; 

    activeCalls.add(roomId);

    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    // Existing users ko unki correct details ke saath bhej rahe hain
    socket.emit(
      "existing-users",
      clients
        .filter((id) => id !== socket.id)
        .map((id) => {
          const clientSocket = io.sockets.sockets.get(id);
          return {
            socketId: id,
            name: clientSocket?.userName || "User",
            camOn: clientSocket?.camOn ?? true,
          };
        })
    );

    // 🔥 Sync Fix: Naye user ki info sabko broadcast karo
    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
      name: socket.userName,
      camOn: true,
    });

    io.to(roomId).emit("call-started");
  });

  socket.on("camera-toggle", ({ roomId, camOn }) => {
    socket.camOn = camOn; // Server state update
    socket.to(roomId).emit("camera-toggle", {
      socketId: socket.id,
      camOn,
    });
  });

  // WebRTC Signal Events
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
    const room = io.sockets.adapter.rooms.get(roomId);
    if (!room || room.size === 0) activeCalls.delete(roomId);
  });

  socket.on("disconnect", () => {
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("video-user-left", { socketId: socket.id });
    });
  });
};

export default videoSocket;