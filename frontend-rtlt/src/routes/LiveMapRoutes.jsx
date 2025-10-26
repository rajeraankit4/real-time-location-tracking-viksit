import { Routes, Route } from "react-router-dom";
import CommonMap from "../components/liveMap/CommonMap";
import JoinGroup from "../components/liveMap/JoinGroup";
import CreateGroup from "../components/liveMap/CreateGroup";
import LiveMapSetup from "../components/liveMap/LiveMapSetup";
function LiveMapRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LiveMapSetup />} />
      <Route path=":room" element={<CommonMap />} />
      <Route path="join-group" element={<JoinGroup />} />
      <Route path="create-group" element={<CreateGroup />} />
    </Routes>
  );
}

export default LiveMapRoutes;
