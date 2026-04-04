import { io } from "socket.io-client";

// 🔥 API URL from .env
const API_URL = import.meta.env.VITE_API_URL;

// 🔍 Debug (temporary – baad me hata sakte ho)
console.log("🌐 API_URL:", API_URL);

// ❌ Agar missing ho toh error dikhao
if (!API_URL) {
  console.error("❌ VITE_API_URL missing in .env file");
}

// ✅ Create socket connection
const videoSocket = io(API_URL, {
  transports: ["websocket"], // force websocket
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// 🔥 Connection logs (debug ke liye)
videoSocket.on("connect", () => {
  console.log("✅ Socket connected:", videoSocket.id);
});

videoSocket.on("connect_error", (err) => {
  console.error("❌ Socket connection error:", err.message);
});

videoSocket.on("disconnect", (reason) => {
  console.log("⚠️ Socket disconnected:", reason);
});

export default videoSocket;