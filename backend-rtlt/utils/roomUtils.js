import { roomUsers, roomMarkers, roomData } from "../sockets/socketHandler.js";

export function handleLeaveRoom(io, socket) {
  const { room, userName } = socket.data || {};
  if (!room) return;

  cleanupRoom(io, socket, room, userName);

  socket.leave(room);
  socket.data = {};
}

export function handleDisconnect(io, socket) {
  const { room, userName } = socket.data || {};

  cleanupRoom(io, socket, room, userName);

  console.log("🔴 User disconnected:", socket.id);
}

function cleanupRoom(io, socket, room, userName) {
  if (!room || !roomUsers.has(room)) return;

  const users = roomUsers.get(room).filter((u) => u.id !== socket.id);
  roomUsers.set(room, users);

  io.in(room).emit("roomUsers", users);
  io.in(room).emit("userLeft", { userId: socket.id, userName });

  if (users.length === 0 && room !== "common") {
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
