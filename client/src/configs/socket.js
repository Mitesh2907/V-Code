import { io } from "socket.io-client";

const socket = io("https://v-code-production-8f3a.up.railway.app", {
  withCredentials: true,
});

export default socket;
