// src/components/liveMap/CommonMap.jsx
import React from "react";
import { useParams } from "react-router-dom";
import LiveMap from "./LiveMap";
import UserInfo from "./UserInfo";
import ActionButtons from "./ActionButtons";
import { getUserFromToken } from "../../utils/auth";
import RoomName from "./RoomName";
import ConnectedUsers from "./ConnectedUsers";
import { socket } from "../../socket/socket";
import { useState } from "react";

export default function CommonMap() {
  const tokenUser = getUserFromToken();
  const userName = tokenUser?.name;

  // read room from URL param (e.g. /.../:room). If no param, fallback to 'common'
  const params = useParams();
  const room = params?.room;

  const [isAddingMarker, setIsAddingMarker] = useState(false);

  const handleMapClick = (coords) => {
    // only act when in 'adding marker' mode
    if (!isAddingMarker) return;
    const marker = {
      id: `${userName || 'anon'}-${Date.now()}`,
      ...coords,
      label: "User Marker",
      addedBy: userName,
      createdAt: Date.now(),
    };
    console.log(`📤 CommonMap emitting addMarker by ${userName}:`, marker);
    socket.emit("addMarker", { room, marker, addedBy: userName });
    setIsAddingMarker(false);
  };

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
      <RoomName room={room} />
      <ConnectedUsers room={room} />
      <LiveMap room={room} userName={userName} onMapClick={handleMapClick} isAddingMarker={isAddingMarker} />
      <UserInfo userName={userName} />
      <ActionButtons room={room} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} />
    </div>
  );
}
