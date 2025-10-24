import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL);

export default function useLiveMap(room, userName) {
  const [locations, setLocations] = useState({});
  const [messages, setMessages] = useState([]);
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [unread, setUnread] = useState(false);
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    socket.emit("joinRoom", { room, userName });

    socket.on("receiveLocation", ({ userId, location }) => {
      setLocations((prev) => ({ ...prev, [userId]: location }));
    });

    socket.on("receiveMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
      setUnread(true);
      showPopup(msg);
    });

    socket.on("receiveEmoji", ({ emoji }) => triggerEmoji(emoji));

    socket.on("newMarker", (marker) => {
      setMarkers((prev) => [...prev, marker]);
    });

    return () => {
      socket.off("receiveLocation");
      socket.off("receiveMessage");
      socket.off("receiveEmoji");
      socket.off("newMarker");
    };
  }, [room]);

  const sendLocation = (coords) => socket.emit("sendLocation", { room, location: coords });
  const sendMessage = (message) => socket.emit("sendMessage", { room, userName, message });
  const sendEmoji = (emoji) => socket.emit("sendEmoji", { room, emoji });
  const addMarker = (coords, label, emoji) => socket.emit("addMarker", { room, userName, coords, label, emoji });

  const showPopup = (msg) => {
    const id = Date.now();
    setPopups((p) => [...p, { id, msg }]);
    setTimeout(() => setPopups((p) => p.filter((x) => x.id !== id)), 4000);
  };

  const triggerEmoji = (emoji) => {
    const id = Date.now();
    setFloatingEmojis((p) => [...p, { id, emoji }]);
    setTimeout(() => setFloatingEmojis((p) => p.filter((x) => x.id !== id)), 3000);
  };

  return {
    locations,
    sendLocation,
    sendMessage,
    sendEmoji,
    addMarker,
    messages,
    unread,
    setUnread,
    popups,
    floatingEmojis,
    markers,
  };
}
