import { roomUsers, roomMarkers, roomData } from "../sockets/socketHandler.js";

export function handleLeaveRoom(io, socket) {
  const { room, userName } = socket.data || {};
  if (!room) return;

  if (roomUsers.has(room)) {
    // Remove user from room list
    const users = roomUsers.get(room).filter((u) => u.id !== socket.id);
    roomUsers.set(room, users);

    // Leave socket room
    socket.leave(room);
    socket.data = {};

    // Notify remaining users
    io.in(room).emit("roomUsers", users);
    io.in(room).emit("userLeft", { userId: socket.id, userName });

    // If no users left, cleanup room after 5 seconds
    if (users.length === 0) {
      setTimeout(() => {
        const stillEmpty = (roomUsers.get(room) || []).length === 0;
        if (stillEmpty) {
          roomUsers.delete(room);
          roomData.delete(room);
          delete roomMarkers[room];
          console.log(`🧹 Cleaned up empty room '${room}'`);
        }
      }, 5000);
    }
  }
}

export function handleDisconnect(io, socket) {
  const { room, userName } = socket.data || {};
  if (room && roomUsers.has(room)) {
    const users = roomUsers.get(room).filter((u) => u.id !== socket.id);
    roomUsers.set(room, users);

    io.in(room).emit("roomUsers", users);
    io.in(room).emit("userLeft", { userId: socket.id, userName });

    if (users.length === 0) {
      setTimeout(() => {
        if ((roomUsers.get(room) || []).length === 0) {
          roomUsers.delete(room);
          roomData.delete(room);
          delete roomMarkers[room];
          console.log(`🧹 Cleaned up empty room '${room}'`);
        }
      }, 5000);
    }
  }

  console.log("🔴 User disconnected:", socket.id);
}