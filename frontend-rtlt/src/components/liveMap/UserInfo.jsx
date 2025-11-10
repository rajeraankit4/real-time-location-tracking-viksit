// src/components/common/UserInfo.jsx
import React, { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";
import { useRoom } from "../../context/RoomContext";

export default function UserInfo() {
  const { socket } = useSocket();
  const { userName, room  } = useRoom();
  const [socketId, setSocketId] = useState(socket.id);

  // Update socket ID when connection is established
  useEffect(() => {
    const handleConnect = () => setSocketId(socket.id);
    socket.on("connect", handleConnect);
    return () => socket.off("connect", handleConnect);
  }, [socket]);

  return (
    <div
    style={{
      position: "absolute",
      top: 14,
      right: 20,
      zIndex: 1100,
      padding: "6px 10px",
      background: "rgba(255, 255, 255, 0.3)",
      backdropFilter: "blur(2px)",             // adds blur
      WebkitBackdropFilter: "blur(6px)",       // Safari support
      borderRadius: "4px",
      boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
      fontSize: "12px",
      lineHeight: "1.3",
      minWidth: "120px"
    }}
  >
  <p>
    <strong>Room:</strong> {room}
  </p>
  <p>
    <strong>Username:</strong> {userName}
  </p>
  <p>
    <strong>Socket ID:</strong> {socketId || "Connecting..."}
  </p>
</div>

  );
}
