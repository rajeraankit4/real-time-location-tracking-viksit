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
import { SocketProvider } from "../../context/SocketContext";
import { RoomProvider } from "../../context/RoomContext";
import useRoomValidation from "../../hooks/useRoomValidation";
import toast from "react-hot-toast";

export default function CommonMap() {
  const { room } = useParams();
  const { checking, validRoom } = useRoomValidation(room); //room existence check
  const [joined, setJoined] = useState(false);
  const [initialUsers, setInitialUsers] = useState([]);
  const [initialMarkers, setInitialMarkers] = useState([]);
  const userName = getUserFromToken()?.name;
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (checking) return; 
    if (!validRoom) return; 


    const params = new URLSearchParams(location.search);
    const password = params.get("password") || "";

    const handleJoinError = ({ type, message }) => {
      toast.error(message || "Could not join room");
      if (type === "password_required" || type === "wrong_password") {
        navigate(`/live-map/join/${room}/password-form`, { replace: true });
      } else if (type === "not_found") {
        navigate("/live-map/room-not-found", { replace: true });
      }
    };

    const handleJoinSuccess = (data) => {
      setInitialUsers(data?.users || []);
      if (data?.markers && Array.isArray(data.markers)) setInitialMarkers(data.markers);
      setJoined(true); // ✅ only render map after join success
    };

    socket.on("joinError", handleJoinError);
    socket.on("joinSuccess", handleJoinSuccess);

    if (!socket.connected) socket.connect();
    socket.emit("joinRoom", { room, userName, password });

    return () => {
      socket.off("joinError", handleJoinError);
      socket.off("joinSuccess", handleJoinSuccess);
    };
  }, [checking, validRoom, room, userName, location.search, navigate]);

  if (checking) return <p>Checking room...</p>;
  if (!validRoom) return null;
  if (!joined) return <p>Joining room...</p>;

  return (
    <SocketProvider>
      <RoomProvider room={room} userName={userName} initialUsers={initialUsers} initialMarkers={initialMarkers}>
        <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
          <RoomName />
          <ConnectedUsers />
          <LiveMap />
          <UserInfo />
          <ActionButtons />
        </div>
      </RoomProvider>
    </SocketProvider>
  );
}
