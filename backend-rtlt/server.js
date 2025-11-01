import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import authRoutes from "./routes/authRoutes.js";
import roomRoutes from "./routes/roomRoutes.js";
import setupSocketHandlers from "./sockets/socketHandler.js";
import mongoose from "mongoose";

const app = express();
const server = http.createServer(app);

// Middleware
app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Connect to MongoDB
try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB connected successfully");
} catch (err) {
  console.error("❌ MongoDB connection failed:", err.message);
  process.exit(1);
}

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/room", roomRoutes);

// Setup Socket.io
const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*", credentials: true },
});
setupSocketHandlers(io);

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
