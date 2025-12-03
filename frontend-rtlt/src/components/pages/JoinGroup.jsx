import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getUserFromToken } from "../../utils/auth";
import GradientLayout from "../GradientLayout";

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
    <GradientLayout>
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
    </GradientLayout>
  );
};

export default JoinGroup;
