// src/components/liveMap/RoomName.jsx
import React from "react";

export default function RoomName({ room }) {
  return (
    <div
      style={{
        position: "absolute",
        top: 12,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        background: "rgba(0, 0, 0, 0.4)",
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 6,
        fontWeight: 600,
        pointerEvents: "none",
      }}
    >
      {`Room: ${room}`}
    </div>
  );
}
