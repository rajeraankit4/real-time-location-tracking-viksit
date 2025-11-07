import React from "react";
import { useNavigate } from "react-router-dom";
import { runAppCleanup } from "../../utils/runAppCleanup";
import { useRoom } from "../../context/RoomContext";
import { useSocket } from "../../context/SocketContext";

const ExitButton = () => {
  const navigate = useNavigate();
  const { room, setIsAddingMarker, setPendingMarker, setLabel } = useRoom();
  const { emit } = useSocket();

  const handleExit = () => {
    emit("leaveRoom", room); // Notify server to leave room
    runAppCleanup({
      emit,
      setIsAddingMarker,
      setPendingMarker,
      setLabel,
    });
    navigate("/dashboard"); // Redirect to dashboard
  };

  return (
    <button
  onClick={handleExit}
  className="absolute top-2 left-12 z-1000 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 active:scale-95 transition"
>
  Exit
</button>

  );
};

export default ExitButton;