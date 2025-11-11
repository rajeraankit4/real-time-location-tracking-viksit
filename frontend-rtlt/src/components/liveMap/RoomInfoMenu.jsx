import { useState } from "react";
import { FaEllipsisV } from "react-icons/fa";
import toast from "react-hot-toast";
import { useRoom } from "../../context/RoomContext";

export default function RoomInfoMenu() {
  const { room } = useRoom();
  const [open, setOpen] = useState(false);
  const params = new URLSearchParams(window.location.search);
  const passwordFromURL = params.get("password");

  const shareLink = passwordFromURL
    ? `${window.location.origin}/live-map/join/${room}?password=${encodeURIComponent(passwordFromURL)}`
    : `${window.location.origin}/live-map/join/${room}`;

  return (
    <div className="relative">
      {/* 3-dot button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="p-2 rounded-full bg-gray-800 text-white shadow-md hover:bg-gray-700 transition"
      >
        <FaEllipsisV size={16} />
      </button>

      {/* Panel */}
      {open && (
        <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded-md p-2 w-34 text-sm">
            <p><strong>Room:</strong> {room}</p>

            {/* ✅ Show password only if exists */}
            {passwordFromURL && (
            <p><strong>Password:</strong> {passwordFromURL}</p>
            )}

            <button
            onClick={() => {
                navigator.clipboard.writeText(shareLink);
                toast.success("Invite link copied!");
            }}
            className="mt-3 w-full bg-blue-600 text-white text-xs px-1 py-1 rounded hover:bg-blue-700 transition"
            >
            Copy Invite Link
            </button>
        </div>
        )}

    </div>
  );
}
