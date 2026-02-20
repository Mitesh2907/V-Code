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

// admin 
import adminUserRoutes from "./routes/admin/adminUserRoutes.js";
import adminRoomRoutes from "./routes/admin/adminRoomRoutes.js";
import adminSystemRoutes from "./routes/admin/adminSystemRoutes.js";

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

/* ---------------- DATABASE INIT ---------------- */
await connectDB();
await initDB();

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/chat", chatRoutes);

/* ---------------- ADMIN ROUTES ---------------- */
app.use("/api/admin/users", adminUserRoutes);
app.use("/api/admin/rooms", adminRoomRoutes);
app.use("/api/admin", adminSystemRoutes);

app.get("/", (req, res) => {
  res.send("API + Socket Server Running");
});

/* ---------------- SOCKET SETUP ---------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  /* ---------- EXISTING CHAT SOCKET ---------- */
  chatSocket(io, socket);

  /* ================= VIDEO CALL SOCKET ================= */

  // Join video room
  socket.on("video-join-room", ({ roomId }) => {
    socket.join(`video-${roomId}`);
    socket.to(`video-${roomId}`).emit("video-user-joined", {
      socketId: socket.id,
    });
  });

  // Offer
  socket.on("video-offer", ({ offer, target }) => {
    io.to(target).emit("video-offer", {
      offer,
      sender: socket.id,
    });
  });

  // Answer
  socket.on("video-answer", ({ answer, target }) => {
    io.to(target).emit("video-answer", {
      answer,
      sender: socket.id,
    });
  });

  // ICE Candidate
  socket.on("video-ice-candidate", ({ candidate, target }) => {
    io.to(target).emit("video-ice-candidate", {
      candidate,
      sender: socket.id,
    });
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT,  () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
