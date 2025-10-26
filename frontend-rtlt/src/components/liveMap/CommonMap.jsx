// src/components/liveMap/CommonMap.jsx
import LiveMap from "./LiveMap";

export default function CommonMap() {
  const userName = "Ankit";
  const room = "common";

  return <LiveMap room={room} userName={userName} />;
}
