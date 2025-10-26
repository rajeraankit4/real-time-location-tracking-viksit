// src/components/liveMap/CommonMap.jsx
import React from "react";
import LiveMap from "./LiveMap";
import UserInfo from "../common/UserInfo";
import ActionButtons from "../common/ActionButtons";
import { getUserFromToken } from "../../utils/auth";

export default function CommonMap() {
  const tokenUser = getUserFromToken();
  // prefer name from token, fall back to email or a default
  const userName = (tokenUser.name);
  const room = "common";

  const handleAddMarker = () => {
    console.log("Add Marker clicked!");
  };

  const handleSendMessage = () => {
    console.log("Send Message clicked!");
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
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
          pointerEvents: "none"
        }}
      >
        {`Room: ${room}`}
      </div>
      <LiveMap room={room} userName={userName} />
      <UserInfo userName={userName} />
      <ActionButtons />
    </div>
  );
}
