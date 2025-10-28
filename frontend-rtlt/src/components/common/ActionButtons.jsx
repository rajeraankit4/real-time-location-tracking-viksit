import React, { useState } from "react";
import MessageBox from "../common/MessageBox";

export default function ActionButtons({ room }) {
  const [showMessageBox, setShowMessageBox] = useState(false);

  const handleAddMarker = () => {
    console.log("Add Marker clicked!");
  };

  return (
    <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 1000 }}>
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
