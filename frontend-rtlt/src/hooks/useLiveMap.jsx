// src/hooks/useLiveMap.js
import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

export default function useLiveMap(room, userName) {
  const [locations, setLocations] = useState({});
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    socket.connect();
    
    // Join the room
    socket.emit("joinRoom", { room, userName });

    // Listen for initial markers when joining the room
    socket.on("initialMarkers", ({ markers: initial }) => {
      console.log("📦 Received initial markers:", initial);
      if (!initial || !Array.isArray(initial)) return;
      setMarkers(initial); // directly set the initial list
    });


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

    // // Listen for chat messages
    // socket.on("receiveMessage", (msg) => {
    //   // For now just print received messages to the browser console
    //   console.log("📨 Received message:", msg);
    // });

    // Listen for location updates
    socket.on("receiveLocation", ({ userId, location, userName }) => {
      // console.log("📡 Received:", userId, userName, location);
      setLocations((prev) => ({
        ...prev,
        [userId]: { ...location, userName }, // ✅ store with name
      }));
    });

    socket.on("markerAdded", ({ marker }) => {
      console.log("📡 userLiveMap Received new marker:", marker);
      if (!marker) return;
      setMarkers((prev) => {
        // avoid duplicates by id when possible
        if (marker.id && prev.some((m) => m.id === marker.id)) return prev;
        return [...prev, marker];
      });
    });

    return () => {
      socket.off("userJoined");
      socket.off("receiveLocation");
      socket.off("userLeft", handleUserLeft);
      socket.off("receiveMessage");
      socket.off("markerAdded");
      socket.off("initialMarkers");
      socket.disconnect();
    };
  }, [room, userName]);

  const sendLocation = (coords) => {
    socket.emit("sendLocation", { room, location: coords });
  };

  return { locations, markers, sendLocation };
}
