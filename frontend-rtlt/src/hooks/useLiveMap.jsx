// src/hooks/useLiveMap.js
import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

export default function useLiveMap(room, userName) {
  const [locations, setLocations] = useState({});

  useEffect(() => {
    socket.connect();

    // Listen for other users joining
    socket.on("userJoined", ({ userId, userName }) => {
      console.log(`${userName} joined`);
      toast.success(`${userName} joined the room!`);
    });

    // Listen for location updates
    socket.on("receiveLocation", ({ userId, location }) => {
      setLocations((prev) => ({ ...prev, [userId]: location }));
    });

    // Join the room
    socket.emit("joinRoom", { room, userName });

    return () => {
      socket.off("userJoined");
      socket.off("receiveLocation");
      socket.disconnect();
    };
  }, [room, userName]);

  const sendLocation = (coords) => {
    socket.emit("sendLocation", { room, location: coords });
  };

  return { locations, sendLocation };
}
