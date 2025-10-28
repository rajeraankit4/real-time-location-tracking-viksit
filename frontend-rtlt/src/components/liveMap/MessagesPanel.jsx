import React from "react";

export default function MessagesPanel({ messages = [] }) {
  if (!messages || messages.length === 0) return null;

  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 60,
        zIndex: 1100,
        background: "rgba(255,255,255,0.98)",
        borderRadius: 8,
        padding: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        width: 280,
        maxHeight: 320,
        overflowY: "auto",
        fontSize: 14,
        marginLeft: 200,
        overflowY: "auto",
        scrollbarWidth: "none", // hides scrollbar in Firefox
        msOverflowStyle: "none", // hides scrollbar in IE/Edge
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Recent messages</div>

      {messages
        .slice()
        .map((m, i) => (
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
        ))}
    </div>
  );
}
