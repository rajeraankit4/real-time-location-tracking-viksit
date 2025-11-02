// src/hooks/useLiveMap.js
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

export default function useLiveMap(room, userName) {
  const navigate = useNavigate();
  const location = useLocation();
  const [locations, setLocations] = useState({});
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    socket.connect();

    const query = new URLSearchParams(location.search);
    const password = query.get("password") || "";

    socket.emit("joinRoom", { room, userName, password });

    socket.on("initialMarkers", ({ markers: initial }) => {
      console.log("📦 Received initial markers:", initial);
      if (!initial || !Array.isArray(initial)) return;
      setMarkers(initial);
    });

    socket.on("userJoined", ({ userId, userName }) => {
      console.log(`${userName} joined`);
      toast.success(`${userName} joined the room!`);
    });

    const handleUserLeft = ({ userId, userName }) => {
      console.log(`${userName} left the room`);
      setLocations((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
      toast(`${userName} left the room`);
    };

    socket.on("userLeft", handleUserLeft);

    socket.on("receiveLocation", ({ userId, location, userName }) => {
      setLocations((prev) => ({
        ...prev,
        [userId]: { ...location, userName },
      }));
    });

    socket.on("markerAdded", ({ marker }) => {
      if (!marker) return;
      setMarkers((prev) =>
        marker.id && prev.some((m) => m.id === marker.id) ? prev : [...prev, marker]
      );
    });

    // ✅ Simplified: single error event
    socket.on("joinError", ({ message }) => {
      toast.error(message);
      socket.disconnect();
      navigate("/live-map/room-not-found", { replace: true });
    });

    socket.on("passwordRequired", ({ message }) => {
      navigate(`/live-map/join/${room}/password-form`, { replace: true });
    });

    return () => {
      socket.off("userJoined");
      socket.off("receiveLocation");
      socket.off("userLeft", handleUserLeft);
      socket.off("markerAdded");
      socket.off("initialMarkers");
      socket.off("joinError");
      socket.off("passwordRequired");
      socket.disconnect();
    };
  }, [room, userName]);


  const sendLocation = (coords) => {
    socket.emit("sendLocation", { room, location: coords });
  };

  return { locations, markers, sendLocation };
}
