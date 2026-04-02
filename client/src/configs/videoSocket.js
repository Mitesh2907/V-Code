import { io } from "socket.io-client";

const API_URL = import.meta.env.VITE_API_URL;

if (!API_URL) {
  console.error("❌ VITE_API_URL missing");
}

const videoSocket = io(API_URL, {
  transports: ["websocket"],
});

export default videoSocket;