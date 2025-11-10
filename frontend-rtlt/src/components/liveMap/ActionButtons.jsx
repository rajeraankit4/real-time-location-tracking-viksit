import React, { useState } from "react";
import MessageBox from "./MessageBox";
import MessagesPanel from "./MessagesPanel";
import useMessages from "../../hooks/useMessages";
import { Bell } from "lucide-react";
import { useRoom } from "../../context/RoomContext";

export default function ActionButtons() {
  const { room, isAddingMarker, setIsAddingMarker } = useRoom();
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [showPanel, setShowPanel] = useState(false);
  const messages = useMessages(room);

  const handlePanelToggle = () => setShowPanel((prev) => !prev);

  const handleCloseMessageBox = () => setShowMessageBox(false);

  const handleAddMarker = () => setIsAddingMarker(true);

  return (
    <div className="absolute bottom-1 left-1 z-1000 flex flex-col items-start gap-3">
      
      {/* Message panel */}
      {showPanel && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-16 left-0 z-1000]"
        >
          <MessagesPanel messages={messages} onClose={handlePanelToggle} />
        </div>
      )}

      {/* Buttons Row */}
      <div className="flex items-center gap-3">

        {/* Notification / Chat */}
        <button
          onClick={handlePanelToggle}
          className="p-3 rounded-md bg-white shadow-md border border-gray-300 active:scale-95 transition"
        >
          <Bell size={16} />
        </button>

        {/* Add Marker */}
        <button
          onClick={handleAddMarker}
          className="px-4 py-2 rounded-md bg-blue-600 text-white shadow-md hover:bg-blue-700 active:scale-95 transition"
        >
          {isAddingMarker ? "Click Map" : "Add Marker"}
        </button>

        {isAddingMarker && (
          <button
            onClick={() => setIsAddingMarker(false)}
            className="px-4 py-2 rounded-md bg-gray-300 text-black shadow-md hover:bg-gray-400 active:scale-95 transition"
          >
            Cancel
          </button>
        )}

        {/* Send Message */}
        <button
          onClick={() => setShowMessageBox((prev) => !prev)}
          className="px-4 py-2 rounded-md bg-green-600 text-white shadow-md hover:bg-green-700 active:scale-95 transition"
        >
          Send
        </button>
      </div>

      {showMessageBox && <MessageBox room={room} onClose={handleCloseMessageBox} />}
    </div>
  );


}