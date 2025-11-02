// src/components/liveMap/CommonMap.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import LiveMap from "./LiveMap";
import UserInfo from "./UserInfo";
import ActionButtons from "./ActionButtons";
import { getUserFromToken } from "../../utils/auth";
import RoomName from "./RoomName";
import ConnectedUsers from "./ConnectedUsers";
import { socket } from "../../socket/socket";
import useRoomValidation from "../../hooks/useRoomValidation";
import toast from "react-hot-toast";

export default function CommonMap() {
  const { room } = useParams();
  const { checking, validRoom } = useRoomValidation(room); //room existence check
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const userName = getUserFromToken()?.name;
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (checking) return; // wait for validation to complete
    if (!validRoom) return; // don't attempt join if invalid

    // ensure socket is connected
    if (!socket.connected) socket.connect();

    // optional password from query string
    const params = new URLSearchParams(location.search);
    const password = params.get("password") || "";

    // attempt to join (password may be empty)
    socket.emit("joinRoom", { room, userName, password });

    const handleJoinError = ({ type, message }) => {
      toast.error(message || "Could not join room");
      if (type === "password_required" || type === "wrong_password") {
        navigate(`/live-map/join/${room}/password-form`, { replace: true });
      } else if (type === "not_found") {
        navigate("/live-map/room-not-found", { replace: true });
      }
    };

    socket.on("joinError", handleJoinError);

    return () => {
      socket.off("joinError", handleJoinError);
      socket.disconnect();
    };
  }, [checking, validRoom, room, userName, location.search, navigate]);

  if (checking) return <p>Checking room...</p>;
  if (!validRoom) return null;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
      <RoomName room={room} />
      <ConnectedUsers room={room} />
      <LiveMap room={room} userName={userName} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} />
      <UserInfo userName={userName} />
      <ActionButtons room={room} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} />
    </div>
  );
}
