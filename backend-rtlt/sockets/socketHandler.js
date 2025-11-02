export const roomUsers = new Map(); // room → [ { id, userName } ]  i.e. users for each room
export const roomMarkers = {}; // room → [ { id, lat, lng, timestamp } ] i.e. markers for each room
export const roomData = new Map(); // room → { password: null or string }

function handleCreateRoom(io, socket, { room, password }) {
  if (roomData.has(room)) {
    socket.emit("createError", { message: "Room already exists" });
    return;
  }

  // Save room details
  roomData.set(room, { password: password || null });
  roomUsers.set(room, []);
  roomMarkers[room] = [];

  console.log(`🆕 Room created: ${room}`);

  // Send room info back to creator
  socket.emit("createSuccess", {
    room,
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

  // 🛑 Already joined this room
  if (socket.data?.room === room) {
    socket.emit("joinError", { type: "already_joined", message: "Already joined this room" });
    return;
  }

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
  socket.emit("joinSuccess", { room });
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

    socket.on("sendLocation", ({ room, location }) => {
      io.to(room).emit("receiveLocation", {
        userId: socket.id,
        userName: socket.data.userName,
        location,
      });
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

    socket.on("addMarker", ({ room, marker }) => {
      if (!room || !marker) return;

      const markerWithTime = { ...marker, timestamp: Date.now() };
      roomMarkers[room] = roomMarkers[room] || [];

      if (!roomMarkers[room].some((m) => m.id === marker.id)) {
        roomMarkers[room].push(markerWithTime);
      }

      io.to(room).emit("markerAdded", { marker: markerWithTime });
    });

    socket.on("disconnect", () => {
      const { room, userName } = socket.data;
      if (room && roomUsers.has(room)) {
        const users = roomUsers.get(room).filter((u) => u.id !== socket.id);
        roomUsers.set(room, users);

        io.in(room).emit("roomUsers", users);
        io.in(room).emit("userLeft", { userId: socket.id, userName });

        if (users.length === 0) {
          console.log(`🧹 Scheduling cleanup for room '${room}'`);
          setTimeout(() => {
            if ((roomUsers.get(room) || []).length === 0) {
              delete roomMarkers[room];
            }
          }, 5000);
        }
      }

      console.log("🔴 User disconnected:", socket.id);
    });
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
