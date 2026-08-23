import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Document from "../models/Document.js";

const presence = new Map(); // docId -> Map(socketId -> { id, name })

async function getUserFromSocket(socket) {
  try {
    const token = socket.handshake?.auth?.token;
    if (!token || !process.env.JWT_SECRET) return null;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("name");
    return user ? { id: String(user._id), name: user.name || "User" } : null;
  } catch (err) {
    return null;
  }
}

function broadcastPresence(io, docId) {
  try {
    const room = presence.get(docId);
    const users = room ? Array.from(room.values()) : [];
    io.to(docId).emit("presence-update", users);
  } catch (err) {
    console.error("presence broadcast error:", err.message);
  }
}

export function registerDocumentSocket(io) {
  io.on("connection", (socket) => {
    let currentDocId = null;

    socket.on("join-document", async (docId) => {
      try {
        currentDocId = docId;
        socket.join(docId);

        const user = await getUserFromSocket(socket);
        if (user) {
          if (!presence.has(docId)) presence.set(docId, new Map());
          presence.get(docId).set(socket.id, user);
          broadcastPresence(io, docId);
        }
      } catch (err) {
        console.error("join-document error:", err.message);
      }
    });

    socket.on("leave-document", (docId) => {
      try {
        socket.leave(docId);
        if (presence.has(docId)) {
          presence.get(docId).delete(socket.id);
          broadcastPresence(io, docId);
        }
      } catch (err) {
        console.error("leave-document error:", err.message);
      }
    });

    socket.on("document-change", async ({ docId, title, content }) => {
      try {
        socket.to(docId).emit("document-change", { title, content });
        await Document.findByIdAndUpdate(docId, {
          ...(title !== undefined && { title }),
          ...(content !== undefined && { content }),
        });
      } catch (err) {
        console.error("document-change error:", err.message);
      }
    });

    socket.on("disconnect", () => {
      try {
        if (currentDocId && presence.has(currentDocId)) {
          presence.get(currentDocId).delete(socket.id);
          broadcastPresence(io, currentDocId);
        }
      } catch (err) {
        console.error("disconnect error:", err.message);
      }
    });
  });
}