import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function useLiveMap(room, userName) {
  const [locations, setLocations] = useState({});

  useEffect(() => {
    console.log("🟢 useLiveMap mounted for room:", room, "user:", userName);

    // 🔹 Emit join event
    console.log("📡 Emitting joinRoom event...");
    socket.emit("joinRoom", { room, userName });

    // 🔹 When location is received
    socket.on("receiveLocation", ({ userId, location }) => {
      console.log(`📍 Received location from ${userId}:`, location);
      setLocations((prev) => ({ ...prev, [userId]: location }));
    });

        
    // 🔹 When new user joins
    socket.on("userJoined", ({ userId, userName }) => {
      console.log(`🚀 User joined: ${userName} (${userId})`);
      toast.success(`${userName} joined the room!`);
    });


    // 🔹 Cleanup on unmount
    return () => {
      console.log("🔴 Cleaning up socket listeners...");
      socket.off("receiveLocation");
      socket.off("userJoined");
    };
  }, [room, userName]);

  // 🔹 Send user's location
  const sendLocation = (coords) => {
    console.log("🛰️ Sending location:", coords);
    socket.emit("sendLocation", { room, location: coords });
  };

  return { locations, sendLocation };
}
