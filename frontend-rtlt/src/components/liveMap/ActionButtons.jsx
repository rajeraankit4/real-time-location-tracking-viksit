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

  const handlePanelToggle = () => {
    setShowPanel((prev) => !prev);
  };

  const handleAddMarker = () => setIsAddingMarker(true);

  return (
    <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 1000 }}>
      {/* Message panel itself */}
      {showPanel && (
        <div
          onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside panel
          style={{
            position: "absolute",
            bottom: 70,
            left: 0,
            zIndex: 1000,
          }}
        >
          <MessagesPanel messages={messages} />
        </div>
      )}

      {/* Buttons */}
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        
        {/* Bell icon */}
        <button className="btn btn-light" onClick={handlePanelToggle}>
          <Bell size={20} />
        </button>

        <button
          onClick={handleAddMarker}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg shadow-md transition-all duration-200"
        >
          {isAddingMarker ? "Click on map to add" : "Add Marker"}
        </button>

        {isAddingMarker && (
          <button
            onClick={() => setIsAddingMarker(false)}
            className="bg-gray-300 hover:bg-gray-400 text-black font-medium px-3 py-2 rounded-lg shadow-md transition-all duration-200"
            style={{ marginLeft: 8 }}
          >
            Cancel
          </button>
        )}

        <button
          className="btn btn-secondary"
          onClick={() => setShowMessageBox((prev) => !prev)}
        >
          Send Message
        </button>

      </div>

      {showMessageBox && (
        <MessageBox room={room} onClose={() => setShowMessageBox(false)} />
      )}
    </div>
  );
}