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

  /* ---------------- VIDEO JOIN (FIXED DATA STRUCTURE) ---------------- */
  socket.on("video-join-room", ({ roomId, name }) => {
    socket.join(roomId);

    // 🔥 Fix 1: 'name' ko 'userName' property mein store karo conflict se bachne ke liye
    socket.userName = name || "User"; 
    socket.camOn = true; 

    activeCalls.add(roomId);

    // Room ke sabhi connected users ki list lo
    const clients = Array.from(io.sockets.adapter.rooms.get(roomId) || []);

    // 🔥 Fix 2: Existing users ko bhejte waqt confirm karo ki data undefined na ho
    const existingUsers = clients
      .filter((id) => id !== socket.id)
      .map((id) => {
        const clientSocket = io.sockets.sockets.get(id);
        return {
          socketId: id,
          name: clientSocket?.userName || "User",
          camOn: clientSocket?.camOn ?? true,
        };
      });

    socket.emit("existing-users", existingUsers);

    // 🔥 Fix 3: Naye user ki info doosron ko bhejte waqt 'name' key properly use karo
    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
      name: socket.userName,
      camOn: true,
    });

    io.to(roomId).emit("call-started");
  });

  /* ---------------- CAMERA TOGGLE ---------------- */
  socket.on("camera-toggle", ({ roomId, camOn }) => {
    socket.camOn = camOn; // Server par state update karo
    socket.to(roomId).emit("camera-toggle", {
      socketId: socket.id,
      camOn,
    });
  });

  /* ---------------- OTHER EVENTS (OFFER/ANSWER/ICE/LEAVE) ---------------- */
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

  socket.on("call-ended", ({ roomId }) => {
    io.to(roomId).emit("call-ended");
    activeCalls.delete(roomId);
  });

  socket.on("disconnect", () => {
    socket.rooms.forEach((roomId) => {
      socket.to(roomId).emit("video-user-left", { socketId: socket.id });
    });
  });
};

export default videoSocket;