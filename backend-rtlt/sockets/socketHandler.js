export const roomUsers = new Map(); // room → [ { id, userName } ]  i.e. users for each room
export const roomMarkers = {}; // room → [ { id, lat, lng, timestamp } ] i.e. markers for each room
export const roomData = new Map(); // room → { password: null or string }

function handleJoinRoom(io, socket, { room, userName, password }) {
  // 🛑 Prevent duplicate join for same socket
  if (socket.data?.room === room) {
    console.log(`⚠️ ${socket.id} tried to rejoin '${room}', skipping duplicate join.`);

    // Re-send current room state (optional)
    socket.emit("initialMarkers", { markers: roomMarkers[room] || [] });
    io.in(room).emit("roomUsers", roomUsers.get(room) || []);

    return;
  }

  // 🚫 Room existence check
  if (!roomUsers.has(room)) {
    socket.emit("joinError", { message: "Room doesn't exist" });
    return;
  }

  // 🔒 Password check
  const roomInfo = roomData.get(room);
  if (roomInfo?.password && roomInfo.password !== password) {
    socket.emit("joinError", { message: "Incorrect password" });
    return;
  }

  // ✅ Normal join flow
  socket.data = { room, userName };
  socket.join(room);

  const users = [...roomUsers.get(room), { id: socket.id, userName }];
  roomUsers.set(room, users);

  const now = Date.now();
  roomMarkers[room] = (roomMarkers[room] || []).filter(
    (m) => now - m.timestamp < 3600 * 1000
  );

  console.log("✅ Joined room:", room, "→ Users:", users);

  socket.emit("initialMarkers", { markers: roomMarkers[room] });
  io.in(room).emit("userJoined", { userId: socket.id, userName });
  io.in(room).emit("roomUsers", users);
}

export default function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("joinRoom", (data) => handleJoinRoom(io, socket, data));

    socket.on("createRoom", ({ room, password, userName }) => {
      if (roomUsers.has(room)) {
        socket.emit("createError", { message: "Room already exists" });
        return;
      }

      roomUsers.set(room, []);
      roomMarkers[room] = [];
      roomData.set(room, { password: password || null });

      handleJoinRoom(io, socket, { room, userName, password });
      socket.emit("createSuccess", { room });
    });

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
