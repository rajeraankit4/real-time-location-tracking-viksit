// src/hooks/useLiveMap.js
import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

export default function useLiveMap(room, userName) {
  const [locations, setLocations] = useState({});

  useEffect(() => {
    socket.connect();
    
    // Join the room
    socket.emit("joinRoom", { room, userName });

    // Listen for other users joining
    socket.on("userJoined", ({ userId, userName }) => {
      console.log(`${userName} joined`);
      toast.success(`${userName} joined the room!`);
    });

    // Listen for users leaving the room
    const handleUserLeft = ({ userId, userName }) => {
      console.log(`${userName} left the room`);
      // remove the user's location from state
      setLocations((prev) => {
        const next = { ...prev };
        if (userId in next) {
          delete next[userId];
        }
        return next;
      });
      // show toast notification
      toast(`${userName} left the room`);
    };

    socket.on("userLeft", handleUserLeft);

    // Listen for location updates
    socket.on("receiveLocation", ({ userId, location, userName }) => {
      // console.log("📡 Received:", userId, userName, location);
      setLocations((prev) => ({
        ...prev,
        [userId]: { ...location, userName }, // ✅ store with name
      }));
    });

    return () => {
      socket.off("userJoined");
      socket.off("receiveLocation");
      socket.off("userLeft", handleUserLeft);
      socket.disconnect();
    };
  }, [room, userName]);

  const sendLocation = (coords) => {
    socket.emit("sendLocation", { room, location: coords });
  };

  return { locations, sendLocation };
}
