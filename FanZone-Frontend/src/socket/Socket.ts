// socket.ts (React içinde)
import { io } from "socket.io-client";

const token = localStorage.getItem("userToken");

const socket = io("http://localhost:5000", {
  auth: {
    token: token,
  },
});

export default socket;