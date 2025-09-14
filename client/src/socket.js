import { io } from "socket.io-client";

export const socket = io("http://localhost:8001", {
  autoConnect: false,
  auth: {
    token: localStorage.getItem("token"),
  },
});