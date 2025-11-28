import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { socket } from "../../socket/socket";
import toast from "react-hot-toast";

export default function PasswordForm() {
  const { room } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (!socket.connected) socket.connect();
    socket.on("connect_error", () => toast.error("Connection failed"));
    return () => socket.off("connect_error");
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password.trim()) navigate(`/live-map/join/${room}`);
    else
      navigate(
        `/live-map/join/${room}?password=${encodeURIComponent(password)}`
      );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 px-6 relative overflow-hidden">
      {/* background blobs */}
      <div className="absolute w-72 h-72 bg-blue-200 blur-3xl opacity-40 rounded-full top-[-100px] right-[-100px]" />
      <div className="absolute w-72 h-72 bg-purple-200 blur-3xl opacity-40 rounded-full bottom-[-120px] left-[-120px]" />

      <form
        onSubmit={handleSubmit}
        className="backdrop-blur-xl bg-white/50 border border-white/40 shadow-2xl 
                   rounded-2xl p-10 max-w-md w-full text-center"
      >
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          Enter Room Password
        </h2>

        <p className="text-gray-600 mb-6">
          Room <span className="font-semibold text-gray-800">“{room}”</span> is
          protected.
        </p>

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 mb-6 rounded-xl bg-white/70 border border-gray-300 
                     focus:ring-2 focus:ring-blue-400 outline-none shadow-sm"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-medium
                     shadow-lg hover:bg-blue-700 hover:shadow-xl active:scale-95 transition-all"
        >
          Join Room
        </button>
      </form>

      <footer className="absolute bottom-4 text-gray-400 text-xs">
        Secured Access · Encrypted Join
      </footer>
    </div>
  );
}
