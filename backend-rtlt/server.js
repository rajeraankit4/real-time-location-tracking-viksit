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


// ========================================================================================
// Socket.IO setup
// ========================================================================================

const io = new Server(server, {
  cors: { origin: process.env.FRONTEND_URL || "*", credentials: true },
});

const roomUsers = new Map(); // roomName → [ { id, userName } ]
const roomMarkers = {}; // roomName → [ { id, lat, lng, timestamp, ... } ]

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

    // Clean up old markers for the room and send current ones
    const now = Date.now();
    const validMarkers = (roomMarkers[room] || []).filter(
      (m) => now - m.timestamp < 3600 * 1000
    );
    roomMarkers[room] = validMarkers; // keep only valid ones

    // Send them to the new user
    socket.emit("initialMarkers", { markers: validMarkers });

    // Notify others and update everyone’s list
    io.in(room).emit("userJoined", { userId: socket.id, userName });
    io.in(room).emit("roomUsers", users);
  });

  socket.on("sendLocation", ({ room, location }) => {
    // console.log("📍Sending location for:", socket.data.userName);
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

    console.log(`💬 Received message in room '${room}' from '${socket.data.userName}':`, message);

    io.to(room).emit("receiveMessage", msg);
  });

  socket.on("sendEmoji", ({ room, emoji }) => {
    io.to(room).emit("receiveEmoji", {
      userId: socket.id,
      userName: socket.data.userName,
      emoji,
    });
  });

  socket.on("addMarker", ({ room, marker }) => {
    if (!room || !marker) return;

    console.log(`📍 Server Marker received from ${socket.id}:`, marker);

    // Attach timestamp
    const markerWithTime = { ...marker, timestamp: Date.now() };

    if (!roomMarkers[room]) roomMarkers[room] = [];

    // Avoid duplicates by marker.id
    const exists = roomMarkers[room].some((m) => m.id === marker.id);
    if (!exists) roomMarkers[room].push(markerWithTime);

    // Broadcast to everyone in the room
    io.to(room).emit("markerAdded", { marker: markerWithTime });
  });


  socket.on("disconnect", () => {
    const { room, userName } = socket.data;

    if (room && roomUsers.has(room)) {
      const updatedUsers = roomUsers.get(room).filter((u) => u.id !== socket.id);
      roomUsers.set(room, updatedUsers);

      io.in(room).emit("roomUsers", updatedUsers);
      io.in(room).emit("userLeft", { userId: socket.id, userName });

      // Delay cleanup to avoid premature deletion on refresh
      if (updatedUsers.length === 0) {
        console.log(`🧹 Scheduling cleanup for room '${room}'`);
        setTimeout(() => {
          if ((roomUsers.get(room) || []).length === 0) {
            console.log(`🧹 All users left room '${room}', clearing markers`);
            delete roomMarkers[room];
          }
        }, 2000); // wait 2 seconds
      }
    }

    console.log("🔴 User disconnected:", socket.id);
  });

});

// Every 5 minutes, remove markers older than 1 hour
setInterval(() => {
  const now = Date.now();

  for (const room in roomMarkers) {
    const beforeCount = roomMarkers[room]?.length || 0;

    // filter out old markers
    roomMarkers[room] = (roomMarkers[room] || []).filter(
      (m) => now - m.timestamp < 60 * 60 * 1000
    );

    const afterCount = roomMarkers[room].length;

    // If any markers were removed, send updated list
    if (afterCount !== beforeCount) {
      io.to(room).emit("initialMarkers", { markers: roomMarkers[room] });
      console.log(`🧹 Cleaned up old markers in room '${room}'`);
    }
  }
}, 5 * 60 * 1000);



// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
