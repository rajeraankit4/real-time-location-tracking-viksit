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

io.on("connection", (socket) => {
  console.log("🟢 User connected:", socket.id);

  socket.on("joinRoom", ({ room, userName }) => {
    socket.join(room);
    console.log(`${userName} joined ${room}`);
    // store the userName on the socket so we can attach it to subsequent events
    socket.data.userName = userName;
    io.in(room).emit("userJoined", { userId: socket.id, userName });
  });

  socket.on("sendLocation", ({ room, location }) => {
    // include the sender's userName (if available) to avoid client-side races
    io.to(room).emit("receiveLocation", { userId: socket.id, location, userName: socket.data.userName || null });
  });

  socket.on("sendMessage", ({ room, userName, message }) => {
    const msg = { userId: socket.id, userName, message, timestamp: Date.now() };
    io.to(room).emit("receiveMessage", msg);
  });

  socket.on("sendEmoji", ({ room, emoji }) => {
    io.to(room).emit("receiveEmoji", { emoji });
  });

  socket.on("addMarker", ({ room, userName, coords, label, emoji }) => {
    io.to(room).emit("newMarker", { userName, coords, label, emoji });
  });

  socket.on("disconnect", () => {
    console.log("🔴 User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
