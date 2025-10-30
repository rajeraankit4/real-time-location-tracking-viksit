const roomUsers = new Map(); // room → [ { id, userName } ]
const roomMarkers = {}; // room → [ { id, lat, lng, timestamp } ]

export default function setupSocketHandlers(io) {
  io.on("connection", (socket) => {
    console.log("🟢 User connected:", socket.id);

    socket.on("joinRoom", ({ room, userName }) => {
      socket.data = { room, userName };
      socket.join(room);

      // Add user
      if (!roomUsers.has(room)) roomUsers.set(room, []);
      const users = [...roomUsers.get(room), { id: socket.id, userName }];
      roomUsers.set(room, users);

      // Cleanup old markers
      const now = Date.now();
      roomMarkers[room] = (roomMarkers[room] || []).filter(
        (m) => now - m.timestamp < 3600 * 1000
      );

      socket.emit("initialMarkers", { markers: roomMarkers[room] });
      io.in(room).emit("userJoined", { userId: socket.id, userName });
      io.in(room).emit("roomUsers", users);
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
          }, 2000);
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
