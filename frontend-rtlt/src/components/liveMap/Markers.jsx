// src/components/liveMap/Markers.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

// cache to store user color and offset
const userCache = {}; // id -> { color, offset }

const getRandomColor = () => {
  const colors = ["red", "blue", "green", "orange", "purple", "cyan", "pink"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomOffset = () => [
  (Math.random() - 0.5) * 0.0002,
  (Math.random() - 0.5) * 0.0002,
];

export default function Markers({ locations, markers = [] }) {
  return (
    <>
      {Object.entries(locations).map(([id, loc]) => {
        // keep same color & offset for same user
        if (!userCache[id]) {
          userCache[id] = {
            color: getRandomColor(),
            offset: getRandomOffset(),
          };
        }

        const { color, offset } = userCache[id];
        const position = [loc.lat + offset[0], loc.lng + offset[1]];

        const icon = L.divIcon({
          className: "custom-marker",
          html: `<div style="
            background-color: ${color};
            width: 14px;
            height: 14px;
            border-radius: 50%;
            border: 2px solid white;
          "></div>`,
        });

        return (
          <Marker key={id} position={position} icon={icon}>
            <Popup>{loc.userName || "Unknown user"}</Popup>
          </Marker>
        );
      })}

        {/* Render user-added markers */}
        {markers.map((m) => {
          const key = m.id || `${m.lat}-${m.lng}-${m.createdAt || ''}`;
          const position = [m.lat, m.lng];
          const markerIcon = L.divIcon({
            className: "user-added-marker",
            html: `<div style="
              background: rgba(0,123,255,0.9);
              width: 16px;
              height: 16px;
              border-radius: 4px;
              border: 2px solid white;
            "></div>`,
          });

          return (
            <Marker key={key} position={position} icon={markerIcon}>
              <Popup>
                <div style={{ fontWeight: 600 }}>{m.label || "Marker"}</div>
                <div style={{ fontSize: 12, color: "#555" }}>by {m.addedBy || "Unknown"}</div>
              </Popup>
            </Marker>
          );
        })}
    </>
  );
}
