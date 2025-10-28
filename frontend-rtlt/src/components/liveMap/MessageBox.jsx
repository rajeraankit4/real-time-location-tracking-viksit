import React, { useState } from "react";
import { socket } from "../../socket/socket";

export default function MessageBox({ onClose, room }) {
  const presetMessages = ["Good Job", "Gather in the camp", "Move to base", "Stay alert"];
  const [customMsg, setCustomMsg] = useState("");

  const handleSend = (msg) => {
    // emit message to server for the current room
    try {
      socket.emit("sendMessage", { room: room || "common", message: msg });
      console.log("Message emitted:", msg);
    } catch (err) {
      console.error("Failed to emit message:", err);
    }

    setCustomMsg("");
    onClose();
  };

  return (
    <div
      style={{
        position: "absolute",
        bottom: 70,
        left: 20,
        zIndex: 1100,
        background: "white",
        borderRadius: "8px",
        padding: "10px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
        width: 220,
      }}
    >
      <strong>Quick Messages</strong>
      {presetMessages.map((msg) => (
        <div
          key={msg}
          onClick={() => handleSend(msg)}
          style={{
            padding: "6px",
            cursor: "pointer",
            background: "#f9f9f9",
            borderRadius: "5px",
            marginTop: "4px",
          }}
        >
          {msg}
        </div>
      ))}

      <input
        value={customMsg}
        onChange={(e) => setCustomMsg(e.target.value)}
        placeholder="Type custom..."
        style={{
          width: "100%",
          marginTop: "8px",
          padding: "6px",
          borderRadius: "5px",
          border: "1px solid #ccc",
        }}
      />
      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
        <button
          className="btn btn-primary"
          onClick={() => customMsg && handleSend(customMsg)}
        >
          Send
        </button>
        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}
