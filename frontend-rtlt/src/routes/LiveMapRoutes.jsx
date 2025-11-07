import { Routes, Route } from "react-router-dom";
import CommonMap from "../components/liveMap/CommonMap";
import JoinGroup from "../components/pages/JoinGroup";
import CreateGroup from "../components/pages/CreateGroup";
import LiveMapSetup from "../components/pages/LiveMapSetup";
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
