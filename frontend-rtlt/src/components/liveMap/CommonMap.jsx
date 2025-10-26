// src/components/liveMap/CommonMap.jsx
import React from "react";
import { useParams } from "react-router-dom";
import LiveMap from "./LiveMap";
import UserInfo from "../common/UserInfo";
import ActionButtons from "../common/ActionButtons";
import { getUserFromToken } from "../../utils/auth";
import RoomName from "./RoomName";

export default function CommonMap() {
  const tokenUser = getUserFromToken();
  const userName = tokenUser?.name;

  // read room from URL param (e.g. /.../:room). If no param, fallback to 'common'
  const params = useParams();
  const room = params?.room;

  return (
    <div style={{ height: "100vh", width: "100%", position: "relative"  }}>
      <RoomName room={room} />
      <LiveMap room={room} userName={userName} />
      <UserInfo userName={userName} />
      <ActionButtons />
    </div>
  );
}
