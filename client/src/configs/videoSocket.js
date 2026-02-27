import { io } from "socket.io-client";

const videoSocket = io("https://v-code-production-8f3a.up.railway.app", {
  transports: ["websocket"],
});

export default videoSocket;
