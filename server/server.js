import dotenv from "dotenv";
dotenv.config();

import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { registerDocumentSocket } from "./sockets/documentSocket.js";

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  const server = http.createServer(app);

  const io = new Server(server, {
    cors: { origin: process.env.CLIENT_URL || "http://localhost:5173" },
  });

  registerDocumentSocket(io);

  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});