import { io } from "socket.io-client";
import { getToken } from "./api";

const SOCKET_URL = import.meta.env.VITE_API_URL
  ? import.meta.env.VITE_API_URL.replace("/api", "")
  : "http://localhost:5000";

let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io(SOCKET_URL, {
      auth: { token: getToken() },
    });
  }
  return socket;
}