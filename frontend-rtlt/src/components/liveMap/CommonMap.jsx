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
  const [joined, setJoined] = useState(false);
  const [initialUsers, setInitialUsers] = useState([]);
  const [initialMarkers, setInitialMarkers] = useState([]);
  const userName = getUserFromToken()?.name;
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (checking) return; 
    if (!validRoom) return; 

    const createdState = location.state?.created;
    const createdUsers = location.state?.users;

    if (createdState) { //avoids remitting joinRoom
      console.log("✅ Using navigation state to skip re-joining room");
      const createdMarkers = location.state?.markers;
      setInitialUsers(createdUsers || []);
      if (createdMarkers && Array.isArray(createdMarkers)) setInitialMarkers(createdMarkers);
      setJoined(true);
      // Clear the navigation state so refreshes or subsequent navigations
      // don't reuse it.
      navigate(location.pathname + location.search, { replace: true });
      return;
    }

    if (!socket.connected) socket.connect();

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
      // Server now sends the current users list with joinSuccess to avoid race
      // where roomUsers might be emitted before the ConnectedUsers listener mounts.
      setInitialUsers(data?.users || []);
      // accept markers when server includes them with joinSuccess to avoid race
      if (data?.markers && Array.isArray(data.markers)) setInitialMarkers(data.markers);
      setJoined(true); // ✅ only render map after join success
    };

    socket.on("joinError", handleJoinError);
    socket.on("joinSuccess", handleJoinSuccess);

    socket.emit("joinRoom", { room, userName, password });

    return () => {
      socket.off("joinError", handleJoinError);
      socket.off("joinSuccess", handleJoinSuccess);
      socket.disconnect();
    };
  }, [checking, validRoom, room, userName, location.search, navigate]);

  if (checking) return <p>Checking room...</p>;
  if (!validRoom) return null;
  if (!joined) return <p>Joining room...</p>;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
      <RoomName room={room} />
      <ConnectedUsers room={room} initialUsers={initialUsers} />
  <LiveMap room={room} userName={userName} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} initialMarkers={initialMarkers} />
      <UserInfo userName={userName} />
      <ActionButtons room={room} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} />
    </div>
  );
}
