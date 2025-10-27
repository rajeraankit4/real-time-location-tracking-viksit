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

export default function Markers({ locations }) {
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
    </>
  );
}
