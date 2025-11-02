import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket"; // adjust if needed
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth"; // adjust if needed

const CreateGroup = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userName = getUserFromToken()?.name || "Guest";

  useEffect(() => {
    console.log("✅ CreateGroup mounted. Socket connected?", socket.connected);
    if (!socket.connected) socket.connect();

    socket.on("connect", () => console.log("🟢 Socket connected:", socket.id));
    socket.on("disconnect", () => console.log("🔴 Socket disconnected"));

    // Success listener
    socket.on("createSuccess", ({ room, password }) => {
      console.log("🎉 Room created successfully:", room);
      toast.success(`Room "${room}" created!`);
      navigate(`/live-map/join/${room}?password=${encodeURIComponent(password)}`, {
      state: { created: true },
    });
    });

    // Error listener
    socket.on("createError", ({ message }) => {
      console.log("⚠️ Room creation error:", message);
      toast.error(message || "Room creation failed");
    });

    return () => {
      socket.off("createSuccess");
      socket.off("createError");
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [navigate]);

  const handleCreate = (e) => {
    e.preventDefault();

    if (!room.trim()) {
      toast.error("Room name is required");
      return;
    }

    console.log("📤 Emitting createRoom:", { room, password, userName });
    socket.emit("createRoom", { room, password, userName });
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleCreate}
        className="bg-white p-8 rounded-2xl shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-semibold text-center text-gray-700">
          Create a New Room
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
          placeholder="Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Create Room
        </button>
      </form>
    </div>
  );
};

export default CreateGroup;
