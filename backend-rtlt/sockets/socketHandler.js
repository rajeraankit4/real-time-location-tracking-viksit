import { handleLeaveRoom, handleDisconnect } from "../utils/roomUtils.js";

export const roomUsers = new Map(); // room → [ { id, userName } ]  i.e. users for each room
export const roomMarkers = {}; // room → [ { id, lat, lng, timestamp } ] i.e. markers for each room
export const roomData = new Map(); // room → { password: null or string }

roomUsers.set("common", []);        // empty user list
roomMarkers["common"] = [];         // empty marker list
roomData.set("common", { password: null }); // no password

function handleCreateRoom(io, socket, { room, password }) {
  // Generate a unique room name based on user input
  let baseName = room.trim();
  let finalRoomName = baseName;

  // If user-given name already exists, append a 4-digit random number
  while (roomData.has(finalRoomName)) {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000); // 1000–9999
    finalRoomName = `${baseName}-${randomSuffix}`;
  }

  // Save room details
  roomData.set(finalRoomName, { password: password || null });
  roomUsers.set(finalRoomName, []);
  roomMarkers[finalRoomName] = [];

  console.log(`🆕 Room created: ${finalRoomName}`);

  // Send room info back to creator
  socket.emit("createSuccess", {
    room: finalRoomName,
    password: password || null,
    message: "Room created successfully. Use joinRoom to enter.",
  });
}


// ==================== JOIN ROOM ====================
function handleJoinRoom(io, socket, { room, userName, password }) {
  const roomInfo = roomData.get(room);

  // 🚫 Room doesn't exist
  if (!roomInfo) {
    socket.emit("joinError", { type: "not_found", message: "Room not found" });
    return;
  }

  // 🔒 Password check
  if (roomInfo.password) {
    // If no password provided, ask client to show password form
    if (!password) {
      socket.emit("joinError", { type: "password_required", message: "Password required for this room" });
      return;
    }

    // If password provided but incorrect, send an error
    if (roomInfo.password !== password) {
      socket.emit("joinError", { type: "wrong_password", message: "Incorrect password" });
      return;
    }
  }

  // // 🛑 Already joined this room
  // if (socket.data?.room === room) {
  //   socket.emit("joinError", { type: "already_joined", message: "Already joined this room" });
  //   return;
  // }

  // ✅ Join flow
  socket.data = { room, userName };
  socket.join(room);

  // Add user
  const users = [...(roomUsers.get(room) || []), { id: socket.id, userName }];
  roomUsers.set(room, users);

  // Clean old markers (optional)
  const now = Date.now();
  roomMarkers[room] = (roomMarkers[room] || []).filter(
    (m) => now - m.timestamp < 3600 * 1000
  );

  console.log(`✅ ${userName} joined room '${room}'`);
  socket.emit("joinSuccess", { room, users, markers: roomMarkers[room] || [] });
  socket.emit("initialMarkers", { markers: roomMarkers[room] });
  io.in(room).emit("roomUsers", users);
  io.in(room).emit("userJoined", { userId: socket.id, userName });
}

// ==================== SETUP HANDLERS ====================
export default function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("createRoom", (data) => handleCreateRoom(io, socket, data));
    socket.on("joinRoom", (data) => handleJoinRoom(io, socket, data));

    socket.on("leaveRoom", () => handleLeaveRoom(io, socket));

    socket.on("sendLocation", ({ room, location }) => {
      io.to(room).emit("receiveLocation", {
        userId: socket.id,
        userName: socket.data?.userName,
        location,
      });
    });

    socket.on("sendMessage", ({ room, message }) => {
      const msg = {
        userId: socket.id,
        userName: socket.data?.userName,
        message,
        timestamp: Date.now(),
      };
      io.to(room).emit("receiveMessage", msg);
    });

    socket.on("sendEmoji", ({ room, emoji }) => {
      io.to(room).emit("receiveEmoji", {
        userId: socket.id,
        userName: socket.data?.userName,
        emoji,
      });
    });

    socket.on("addMarker", ({ room, marker, addedBy }) => {
      if (!room || !marker) return;

      const markerWithTime = { ...marker, addedBy, timestamp: Date.now() };
      roomMarkers[room] = roomMarkers[room] || [];

      if (!roomMarkers[room].some((m) => m.id === marker.id)) {
        roomMarkers[room].push(markerWithTime);
      }

      io.to(room).emit("markerAdded", { marker: markerWithTime });
    });

    socket.on("disconnect", () => handleDisconnect(io, socket));
  });

  // Cleanup job every 5 minutes
  setInterval(() => {
    const now = Date.now();
    for (const room in roomMarkers) {
      const before = roomMarkers[room]?.length || 0;
      roomMarkers[room] = roomMarkers[room].filter(
        (m) => now - m.timestamp < 3600 * 1000
      );
      if (roomMarkers[room].length !== before) {
        io.to(room).emit("initialMarkers", { markers: roomMarkers[room] });
      }
    }
  }, 5 * 60 * 1000);
}
