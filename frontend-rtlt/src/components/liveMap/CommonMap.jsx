// src/components/liveMap/CommonMap.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LiveMap from "./LiveMap";
import UserInfo from "./UserInfo";
import ActionButtons from "./ActionButtons";
import { getUserFromToken } from "../../utils/auth";
import RoomName from "./RoomName";
import ConnectedUsers from "./ConnectedUsers";
import { socket } from "../../socket/socket";

export default function CommonMap() {
  const { room } = useParams();
  const navigate = useNavigate();
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [checking, setChecking] = useState(true);
  const [validRoom, setValidRoom] = useState(false);
  const userName = getUserFromToken()?.name;

  useEffect(() => {
    const checkRoom = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/room/check/${room}`);
        const data = await res.json();
        if (!data.exists) {
          navigate("/live-map/room-not-found", { replace: true });
        } else {
          setValidRoom(true);
        }
      } catch (err) {
        console.error("Room check failed:", err);
        navigate("/live-map/room-not-found", { replace: true });
      } finally {
        setChecking(false);
      }
    };
    checkRoom();
  }, [room, navigate]);

  if (checking) return <p>Checking room...</p>;
  if (!validRoom) return null; // already redirected

  const handleMapClick = (coords) => {
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
