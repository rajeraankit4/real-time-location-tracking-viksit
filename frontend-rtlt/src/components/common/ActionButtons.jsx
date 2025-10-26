// src/components/common/ActionButtons.jsx
import React from "react";

export default function ActionButtons({ onAddMarker, onSendMessage }) {
  return (
    <div style={{ position: "absolute", bottom: 20, left: 20, zIndex: 1000 }}>
      <button className="btn btn-primary" onClick={onAddMarker} style={{ marginRight: 10 }}>Add Marker</button>
      <button className="btn btn-primary" onClick={onSendMessage}>Send Message</button>
    </div>
  );
}
