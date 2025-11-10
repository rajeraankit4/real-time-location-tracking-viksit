// src/components/liveMap/UserLocationMarkers.jsx
import React, { useRef } from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";

const getRandomColor = () => {
  const colors = ["red", "blue", "green", "orange", "purple", "cyan"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomOffset = () => [
  (Math.random() - 0.5) * 0.0002,
  (Math.random() - 0.5) * 0.0002,
];

export default function UserLocationMarkers({ locations }) {
  const styleMap = useRef({}); // stores color + offset per user

  return (
    <>
      {Object.entries(locations).map(([id, loc]) => {
        // assign style once per user
        if (!styleMap.current[id]) {
          styleMap.current[id] = {
            color: getRandomColor(),
            offset: getRandomOffset(),
          };
        }

        const { color, offset } = styleMap.current[id];
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
            <Tooltip
              permanent
              direction="bottom"
              offset={[0, 6]}
              className="!p-0 !bg-transparent !border-none !shadow-none user-marker-label"
            >
              <div className="bg-white text-black px-2 py-1 rounded text-xs font-medium shadow-sm">
                {loc.userName || "Unknown user"}
              </div>
            </Tooltip>
          </Marker>
        );

      })}
    </>
  );
}
