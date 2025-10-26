// src/components/common/UserInfo.jsx
import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

export default function UserInfo({ userName }) {
  const [socketId, setSocketId] = useState(socket.id);

  // Update socket ID when connection is established
  useEffect(() => {
    const handleConnect = () => setSocketId(socket.id);
    socket.on("connect", handleConnect);
    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);

  return (
    <div style={{ position: "absolute", zIndex: 1000, padding: "10px", background: "white", borderRadius: "5px" }}>
      <p><strong>Username:</strong> {userName}</p>
      <p><strong>Socket ID:</strong> {socketId || "Connecting..."}</p>
    </div>
  );
}
