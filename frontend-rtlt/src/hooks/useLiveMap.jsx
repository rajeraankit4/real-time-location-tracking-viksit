// src/hooks/useLiveMap.js
import { useEffect, useState } from "react";
import { socket } from "../socket/socket";
import toast from "react-hot-toast";

// peers: { [userId]: { lat?, lng?, userName? } }
export default function useLiveMap(room, userName) {
  const [peers, setPeers] = useState({});

  useEffect(() => {
    socket.connect();

    // register our own socket id once connected so other components can show our name
    const handleConnect = () => {
      if (socket.id) {
        setPeers((prev) => ({ ...prev, [socket.id]: { ...(prev[socket.id] || {}), userName } }));
      }
      // actually join the room after connect so server has our socket.id
      socket.emit("joinRoom", { room, userName });
    };

    socket.on("connect", handleConnect);

    // other users joining: store their name
    const handleUserJoined = ({ userId, userName: otherName }) => {
      console.log(`${otherName} joined`);
      toast.success(`${otherName} joined the room!`);
      setPeers((prev) => ({ ...prev, [userId]: { ...(prev[userId] || {}), userName: otherName } }));
    };

    socket.on("userJoined", handleUserJoined);

    // Listen for location updates and merge into peers
    const handleReceiveLocation = ({ userId, location, userName: incomingName }) => {
      setPeers((prev) => ({
        ...prev,
        [userId]: {
          ...(prev[userId] || {}),
          ...location,
          ...(incomingName ? { userName: incomingName } : {}),
        },
      }));
    };

    socket.on("receiveLocation", handleReceiveLocation);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("userJoined", handleUserJoined);
      socket.off("receiveLocation", handleReceiveLocation);
      socket.disconnect();
    };
  }, [room, userName]);

  const sendLocation = (coords) => {
    socket.emit("sendLocation", { room, location: coords });
    // optimistically update our own location locally
    if (socket && socket.id) {
      setPeers((prev) => ({ ...prev, [socket.id]: { ...(prev[socket.id] || {}), ...coords, userName } }));
    }
  };

  return { locations: peers, sendLocation };
}
