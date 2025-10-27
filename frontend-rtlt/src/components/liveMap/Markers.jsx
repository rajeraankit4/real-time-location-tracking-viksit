// src/components/liveMap/Markers.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// deterministic offset based on user ID
function getOffset(id) {
  const factor = 0.00005; // ~5 meters
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const latOffset = ((hash % 1000) / 1000 - 0.5) * factor;
  const lngOffset = (((hash >> 3) % 1000) / 1000 - 0.5) * factor;
  return [latOffset, lngOffset];
}

// deterministic color based on user ID
function getColor(id) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360; // hue between 0-359
  return `hsl(${hue}, 70%, 50%)`; // nice saturated color
}

export default function Markers({ locations }) {
  // Only render markers for peers that have valid numeric lat & lng
  const validEntries = Object.entries(locations).filter(([, loc]) =>
    loc && Number.isFinite(loc.lat) && Number.isFinite(loc.lng)
  );

  return (
    <>
      {validEntries.map(([id, loc]) => {
        const [latOffset, lngOffset] = getOffset(id);
        const color = getColor(id);

        // create a colored icon for Leaflet
        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${color};
            width: 16px;
            height: 16px;
            border-radius: 50%;
            border: 2px solid white;
          "></div>`,
          iconSize: [16, 16],
        });

        return (
          <Marker
            key={id}
            position={[loc.lat + latOffset, loc.lng + lngOffset]}
            icon={icon}
          >
            <Popup>{loc?.userName || "Unknown"}</Popup>
          </Marker>
        );
      })}
    </>
  );
}
