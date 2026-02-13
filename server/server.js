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

dotenv.config();

const app = express();

/* ---------------- MIDDLEWARE ---------------- */
app.use(cors({
  origin: "http://localhost:3000",
  credentials: true,
}));
app.use(express.json());

/* ---------------- DATABASE INIT (🔥 IMPORTANT) ---------------- */
await connectDB();
await initDB();

/* ---------------- ROUTES ---------------- */
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/editor", editorRoutes);
app.use("/api/chat", chatRoutes);

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
  chatSocket(io, socket);
});

/* ---------------- START SERVER ---------------- */
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
