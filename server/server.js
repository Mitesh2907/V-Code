import express from "express";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";

import connectDB from "./config/db.js";
import initDB from "./config/initDB.js";

import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import editorRoutes from "./routes/editorRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";
import chatSocket from "./sockets/chatSocket.js";

// Admin routes
import adminAuthRoutes from "./routes/admin/adminAuthRoutes.js";
import adminProfileRoutes from "./routes/admin/adminProfileRoutes.js";
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";
import adminRoomRoutes from "./routes/admin/adminRoomRoutes.js";
import adminSystemRoutes from "./routes/admin/adminSystemRoutes.js";
import adminSettingsRoutes from "./routes/admin/adminSettingsRoutes.js";

dotenv.config();

const app = express();

/* ================= CORS ================= */

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/* ================= DATABASE INIT ================= */

await connectDB();
await initDB();

/* ================= ROUTES ================= */

app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/chat", chatRoutes);

// Admin routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminProfileRoutes);
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/rooms", adminRoomRoutes);
app.use("/api/admin", adminSystemRoutes);
app.use("/api/admin", adminSettingsRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("🚀 API + Socket Server Running");
});

/* ================= SOCKET SETUP ================= */

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: true,
    credentials: true,
  },
});

// 🔥 TRACK VIDEO CALL STATE
const activeCalls = new Set();
const callUsers = {};

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  chatSocket(io, socket);

  /* ================= ROOM ================= */

  // 🔥 JOIN ROOM (editor sync)
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);

    if (activeCalls.has(roomId)) {
      socket.emit("call-started");
    }
  });

  // 🔥 LEAVE ROOM (FIXED)
  socket.on("leave-room", ({ roomId }) => {
    socket.leave(roomId);
  });

  /* ================= VIDEO CALL ================= */

  // 🔥 START / JOIN VIDEO CALL
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(roomId);

    if (!callUsers[roomId]) {
      callUsers[roomId] = new Set();
    }

    callUsers[roomId].add(socket.id);
    activeCalls.add(roomId);

    // ✅ ONLY video users
    const existingUsers = Array.from(callUsers[roomId]).filter(
      (id) => id !== socket.id
    );

    socket.emit("existing-users", existingUsers);

    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
    });

    io.to(roomId).emit("call-started");
  });

  // 🔥 OFFER
  socket.on("video-offer", ({ offer, to }) => {
    io.to(to).emit("video-offer", {
      offer,
      sender: socket.id,
    });
  });

  // 🔥 ANSWER
  socket.on("video-answer", ({ answer, to }) => {
    io.to(to).emit("video-answer", {
      answer,
      sender: socket.id,
    });
  });

  // 🔥 ICE
  socket.on("video-ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("video-ice-candidate", {
      candidate,
      sender: socket.id,
    });
  });

  // 🔥 LEAVE VIDEO CALL
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });

    if (callUsers[roomId]) {
      callUsers[roomId].delete(socket.id);

      if (callUsers[roomId].size <= 1) {
        delete callUsers[roomId];
        activeCalls.delete(roomId);

        io.to(roomId).emit("call-ended");
      }
    }
  });

  // 🔥 DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

    for (const roomId in callUsers) {
      if (callUsers[roomId].has(socket.id)) {
        callUsers[roomId].delete(socket.id);

        if (callUsers[roomId].size <= 1) {
          delete callUsers[roomId];
          activeCalls.delete(roomId);

          io.to(roomId).emit("call-ended");
        }
      }
    }

    socket.broadcast.emit("video-user-left", {
      socketId: socket.id,
    });
  });
});

/* ================= TEST ROUTE ================= */

app.get("/test", async (req, res) => {
  res.json({
    message: "Backend working 🚀",
    status: "success",
  });
});

/* ================= START SERVER ================= */

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});