import React from "react";

export default function CloseButton({ onClose }) {
  return (
    <button
      onClick={onClose}
      style={{
        position: "absolute",
        top: 8,
        right: 8,
        background: "transparent",
        border: "none",
        fontSize: 16,
        cursor: "pointer",
      }}
      aria-label="Close"
    >
      ×
    </button>
  );
}