import { io } from "socket.io-client";

const videoSocket = io(import.meta.env.VITE_API_URL, {
  transports: ["websocket"],
});

export default videoSocket;