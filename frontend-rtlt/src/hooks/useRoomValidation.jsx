import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function useRoomValidation(room) {
  const [checking, setChecking] = useState(true);
  const [validRoom, setValidRoom] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRoom = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/room/check/${room}`);
        const data = await res.json();
        if (!data.exists) {
          navigate("/live-map/room-not-found", { replace: true });
        } else {
          setValidRoom(true);
        }
      } catch (err) {
        console.error("Room check failed:", err);
        navigate("/live-map/room-not-found", { replace: true });
      } finally {
        setChecking(false);
      }
    };
    if (room) checkRoom();
  }, [room, navigate]);

  return { checking, validRoom };
}
