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

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  // Chat socket
  chatSocket(io, socket);

  /* ================= VIDEO CALL ================= */

  // 🔥 JOIN ROOM
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(roomId);

    socket.to(roomId).emit("video-user-joined", {
      socketId: socket.id,
    });
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

  // 🔥 LEAVE ROOM (important)
  socket.on("video-leave-room", ({ roomId }) => {
    socket.leave(roomId);

    socket.to(roomId).emit("video-user-left", {
      socketId: socket.id,
    });
  });

  // 🔥 DISCONNECT
  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);

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