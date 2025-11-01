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
import useRoomValidation from "../../hooks/useRoomValidation";

export default function CommonMap() {
  const { room } = useParams();
  const { checking, validRoom } = useRoomValidation(room); //room existence check
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const userName = getUserFromToken()?.name;

  if (checking) return <p>Checking room...</p>;
  if (!validRoom) return null; 

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
      <RoomName room={room} />
      <ConnectedUsers room={room} />
      <LiveMap room={room} userName={userName} isAddingMarker={isAddingMarker} />
      <UserInfo userName={userName} />
      <ActionButtons room={room} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} />
    </div>
  );
}
