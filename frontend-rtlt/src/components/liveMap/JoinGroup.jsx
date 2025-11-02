import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket"; // adjust if needed
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth"; // adjust if needed

const JoinGroup = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userName = getUserFromToken()?.name || "Guest";

  useEffect(() => {
    console.log("✅ JoinGroup mounted. Socket connected?", socket.connected);
    if (!socket.connected) socket.connect();

    socket.on("connect", () => console.log("🟢 Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("🔴 Socket disconnected"));

    // Success listener — include markers if server sends them
    socket.on("joinSuccess", ({ room, users, markers }) => {
      console.log("🎉 Joined room successfully:", room);
      toast.success(`Joined "${room}"`);
      navigate(`/live-map/join/${room}?password=${encodeURIComponent(password)}`, {
        state: { created: true, users, markers },
      });
    });

    // Error listener
    socket.on("joinError", ({ message, type }) => {
      console.log("⚠️ Join error:", message);
      if (type === "password_required") toast.error("Password required for this room");
      else toast.error(message || "Failed to join room");
    });

    return () => {
      socket.off("joinSuccess");
      socket.off("joinError");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [navigate, password]);

  const handleJoin = (e) => {
    e.preventDefault();

    if (!room.trim()) {
      toast.error("Room name is required");
      return;
    }

    console.log("📤 Emitting joinRoom:", { room, password, userName });
    socket.emit("joinRoom", { room, password, userName });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleJoin}
        className="bg-white p-8 rounded-2xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Join an Existing Room
        </h2>

        <input
          type="text"
          placeholder="Room name"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="password"
          placeholder="Password (if required)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Join Room
        </button>
      </form>
    </div>
  );
};

export default JoinGroup;
