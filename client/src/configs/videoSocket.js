import { io } from "socket.io-client";

const videoSocket = io("https://v-code-production.up.railway.app", {
  transports: ["websocket"],
});

export default videoSocket;
