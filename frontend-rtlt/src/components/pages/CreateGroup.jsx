import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket"; // adjust if needed
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth"; // adjust if needed
import GradientLayout from "../GradientLayout";

const CreateGroup = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userName = getUserFromToken()?.name || "Guest";

  useEffect(() => {
    // console.log("✅ CreateGroup mounted. Socket connected?", socket.connected);
    if (!socket.connected) socket.connect();

    // socket.on("connect", () => console.log("🟢 Socket connected:", socket.id));
    // socket.on("disconnect", () => console.log("🔴 Socket disconnected"));

    // Success listener
    socket.on("createSuccess", ({ room, password }) => {
      // console.log("🎉 Room created successfully:", room);
      toast.success(`Room "${room}" created!`);

      if (password && password.trim() !== "") {
        navigate(`/live-map/join/${room}?password=${encodeURIComponent(password)}`);
      } else {
        navigate(`/live-map/join/${room}`);
      }
    });

    // Error listener
    socket.on("createError", ({ message }) => {
      // console.log("⚠️ Room creation error:", message);
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

    // console.log("📤 Emitting createRoom:", { room, password, userName });
    socket.emit("createRoom", { room, password, userName });
  };

  const handleRoomChange = (e) => {
    const value = e.target.value;

    // Check if invalid character exists
    if (/[^a-zA-Z0-9]/.test(value)) {
      toast.error("Only letters and numbers are allowed", {
        duration: 1500
      });
      return; // do NOT update input
    }

    setRoom(value.toLowerCase()); 
  };

 return (
  <GradientLayout>
    <form
      onSubmit={handleCreate}
      className="backdrop-blur-xl bg-white/50 border border-white/40 shadow-2xl 
                 rounded-2xl p-10 w-96 space-y-5 text-center"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Create a New Room
      </h2>

      <input
        type="text"
        placeholder="Room name"
        value={room}
        onChange={handleRoomChange}
        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 
                   focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
      />

      <input
        type="password"
        placeholder="Password (optional)"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 
                   focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-medium
                   shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all"
      >
        Create Room
      </button>
    </form>
  </GradientLayout>
);
};

export default CreateGroup;
