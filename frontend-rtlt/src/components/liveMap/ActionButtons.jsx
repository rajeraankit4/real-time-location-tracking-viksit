import React, { useState } from "react";
import MessageBox from "./MessageBox";
import MessagesPanel from "./MessagesPanel";
import useMessages from "../../hooks/useMessages";

export default function ActionButtons({ room }) {
  const [showMessageBox, setShowMessageBox] = useState(false);
  const messages = useMessages(room);

  const handleAddMarker = () => {
    console.log("Add Marker clicked!");
  };

  return (
    <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 1000 }}>
      {/* messages panel above the buttons */}
      <MessagesPanel messages={messages} />

      <button
        className="btn btn-primary"
        onClick={handleAddMarker}
        style={{ marginRight: 10 }}
      >
        Add Marker
      </button>

      <button
        className="btn btn-secondary"
        onClick={() => setShowMessageBox((prev) => !prev)}
      >
        Send Message
      </button>

      {showMessageBox && (
        <MessageBox room={room} onClose={() => setShowMessageBox(false)} />
      )}
    </div>
  );
}
