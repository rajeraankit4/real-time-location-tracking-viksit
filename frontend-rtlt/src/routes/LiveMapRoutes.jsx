import { Routes, Route } from "react-router-dom";
import CommonMap from "../components/liveMap/CommonMap";
import JoinGroup from "../components/liveMap/JoinGroup";
import CreateGroup from "../components/liveMap/CreateGroup";
import LiveMapSetup from "../components/liveMap/LiveMapSetup";
import RoomNotFound from "../components/pages/RoomNotFound";
import PasswordForm from "../components/pages/PasswordForm";
function LiveMapRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LiveMapSetup />} />
      <Route path="/join/:room" element={<CommonMap />} />
      <Route path="/join/:room/password-form" element={<PasswordForm />} />
      <Route path="join-group" element={<JoinGroup />} />
      <Route path="create-group" element={<CreateGroup />} />
      <Route path="room-not-found" element={<RoomNotFound />} />
    </Routes>
  );
}

export default LiveMapRoutes;
