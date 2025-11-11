import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket";
import toast from "react-hot-toast";

export default function PasswordForm() {
  const { room } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    // Ensure socket is connected
    if (!socket.connected) socket.connect();

    // Optional: log connection events
    socket.on("connect_error", () => toast.error("Connection failed"));
    return () => socket.off("connect_error");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // ✅ If no password typed → don't include password in URL
    if (!password.trim()) {
      navigate(`/live-map/join/${room}`);
    } else {
      navigate(`/live-map/join/${room}?password=${encodeURIComponent(password)}`);
    }
  };


  return (
    <form onSubmit={handleSubmit}>
      <h3>Room “{room}” requires a password</h3>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Join</button>
    </form>
  );
}
