// Recent messages component
import React from "react";
import CloseButton from "./CloseButton";

export default function MessagesPanel({ messages = [], onClose }) {
  const hasMessages = messages && messages.length > 0;

  return (
    <div
      style={{
        position: "absolute",
        bottom: -20,
        left: -200,
        zIndex: 1100,
        background: "rgba(255,255,255,0.98)",
        borderRadius: 8,
        padding: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: 190,
        maxHeight: 320,
        overflowY: "auto",
        fontSize: 14,
        marginLeft: 200,
        scrollbarWidth: "none", // hides scrollbar in Firefox
        msOverflowStyle: "none", // hides scrollbar in IE/Edge
      }}
    >
      {/* Close button */}
      <CloseButton onClose={onClose} />

      <div style={{ fontWeight: 600, marginBottom: 6 }}>Recent messages</div>

      {hasMessages ? (
        messages.slice().map((m, i) => (
          <div
            key={i}
            style={{
              padding: "6px 8px",
              borderRadius: 6,
              background: "#f7f7f7",
              marginBottom: 6,
              wordBreak: "break-word",
            }}
          >
            <div style={{ fontSize: 12, color: "#333", fontWeight: 600 }}>
              {m.userName}
            </div>
            <div style={{ fontSize: 13, color: "#222" }}>{m.message}</div>
          </div>
        ))
      ) : (
        <div style={{ padding: "6px 8px", color: "#666", fontSize: 13 }}>
          No messages
        </div>
      )}
    </div>
  );
}
