import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth";

const JoinGroup = () => {
  const [room, setRoom] = useState("");
  const navigate = useNavigate();
  const handleJoin = (e) => {
    e.preventDefault();

    if (!room.trim()) {
      toast.error("Room name is required");
      return;
    }

    navigate(`/live-map/join/${room}`);
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 px-6 relative overflow-hidden">
    
    {/* background blobs */}
    <div className="absolute w-72 h-72 bg-blue-200 blur-3xl opacity-40 rounded-full top-[-100px] right-[-100px]" />
    <div className="absolute w-72 h-72 bg-purple-200 blur-3xl opacity-40 rounded-full bottom-[-120px] left-[-120px]" />

    <form
      onSubmit={handleJoin}
      className="backdrop-blur-xl bg-white/50 border border-white/40 shadow-2xl 
                 rounded-2xl p-10 w-96 space-y-5 text-center"
    >
      <h2 className="text-2xl font-bold text-gray-800">
        Join an Existing Room
      </h2>

      <input
        type="text"
        placeholder="Room name"
        value={room}
        onChange={(e) => setRoom(e.target.value)}
        className="w-full px-4 py-3 rounded-xl bg-white/70 border border-gray-300 
                   focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
      />

      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-medium
                   shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all"
      >
        Join Room
      </button>
    </form>
  </div>
);

};

export default JoinGroup;
