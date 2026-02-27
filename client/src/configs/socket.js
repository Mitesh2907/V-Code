import { io } from "socket.io-client";

const socket = io("https://v-code-production.up.railway.app", {
  withCredentials: true,
});

export default socket;
