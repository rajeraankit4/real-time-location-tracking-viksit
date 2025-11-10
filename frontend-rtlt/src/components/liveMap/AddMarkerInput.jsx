// src/components/liveMap/AddMarkerInput.jsx
import React from "react";

export default function AddMarkerInput({
  pendingMarker,
  label,
  setLabel,
  onSave,
  onCancel,
}) {
  if (!pendingMarker) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="absolute top-1/2 left-1/2 z-2000 -translate-x-1/2 -translate-y-1/2
                 bg-white p-4 rounded-lg shadow-lg flex flex-col gap-3"
    >
      <input
        autoFocus
        type="text"
        placeholder="Enter marker label..."
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        className="border border-gray-300 rounded px-3 py-2 w-60 focus:outline-none
                   focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex gap-2">
        <button
          onClick={onSave}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Save
        </button>

        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
