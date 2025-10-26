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
    <div
  style={{
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1100,
    padding: "6px 10px",
    background: "rgba(255, 255, 255, 0.3)", // semi-transparent white
    borderRadius: "4px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
    fontSize: "12px",
    lineHeight: "1.3",
    minWidth: "120px"
  }}
>
  <p style={{ margin: "2px 0" }}>
    <strong>Username:</strong> {userName}
  </p>
  <p style={{ margin: "2px 0" }}>
    <strong>Socket ID:</strong> {socketId || "Connecting..."}
  </p>
</div>

  );
}
