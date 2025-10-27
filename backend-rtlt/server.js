// server.js
import dotenv from "dotenv";
dotenv.config();
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message || err);
    process.exit(1);
  });

// Routes
app.use("/api/auth", authRoutes);

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*", credentials: true },
});

const roomUsers = new Map(); // roomName → [ { id, userName } ]

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", ({ room, userName }) => {
    socket.data.userName = userName;
    socket.data.room = room;
    socket.join(room);

    // Add user to the room
    if (!roomUsers.has(room)) roomUsers.set(room, []);
    const users = roomUsers.get(room);
    users.push({ id: socket.id, userName });
    roomUsers.set(room, users);

    console.log(`${userName} joined ${room}`);
    // console.log("📍Sending location for:", socket.data.userName);

    // Notify others and update everyone’s list
    io.in(room).emit("userJoined", { userId: socket.id, userName });
    io.in(room).emit("roomUsers", users);
  });

  socket.on("sendLocation", ({ room, location }) => {
    console.log("📍Sending location for:", socket.data.userName);
    io.to(room).emit("receiveLocation", { userId: socket.id, 
      userName: socket.data.userName, location });
  });

  socket.on("sendMessage", ({ room, message }) => {
    const msg = {
      userId: socket.id,
      userName: socket.data.userName,
      message,
      timestamp: Date.now(),
    };
    io.to(room).emit("receiveMessage", msg);
  });

  socket.on("sendEmoji", ({ room, emoji }) => {
    io.to(room).emit("receiveEmoji", {
      userId: socket.id,
      userName: socket.data.userName,
      emoji,
    });
  });

  socket.on("addMarker", ({ room, coords, label, emoji }) => {
    io.to(room).emit("newMarker", {
      userId: socket.id,
      userName: socket.data.userName,
      coords,
      label,
      emoji,
    });
  });

  socket.on("disconnect", () => {
    const { room, userName } = socket.data;
    if (room && roomUsers.has(room)) {
      const updatedUsers = roomUsers
        .get(room)
        .filter((u) => u.id !== socket.id);
      roomUsers.set(room, updatedUsers);

      io.in(room).emit("roomUsers", updatedUsers);
      io.in(room).emit("userLeft", { userId: socket.id, userName });
    }

    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
