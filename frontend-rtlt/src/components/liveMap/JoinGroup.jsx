import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth";

const JoinGroup = () => {
  const [room, setRoom] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const userName = getUserFromToken()?.name || "Guest";

  // Instead of emitting joinRoom here, navigate to CommonMap which will
  // centrally handle the join (reads password from query and emits joinRoom).
  const handleJoin = (e) => {
    e.preventDefault();

    if (!room.trim()) {
      toast.error("Room name is required");
      return;
    }

    navigate(`/live-map/join/${room}?password=${encodeURIComponent(password)}`);
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
