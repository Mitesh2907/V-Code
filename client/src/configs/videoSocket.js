import { io } from "socket.io-client";

const videoSocket = io("http://localhost:5000", {
  transports: ["websocket"],
});

export default videoSocket;
