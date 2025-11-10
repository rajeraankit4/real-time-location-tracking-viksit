// src/components/liveMap/UserLocationMarkers.jsx
import React, { useRef } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

const getRandomColor = () => {
  const colors = ["#EF4444", "#3B82F6", "#22C55E", "#F59E0B", "#8B5CF6", "#06B6D4"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomOffset = () => [
  (Math.random() - 0.5) * 0.00025,
  (Math.random() - 0.5) * 0.00025,
];

export default function UserLocationMarkers({ locations }) {
  const styleMap = useRef({});

  return (
    <>
      {Object.entries(locations).map(([id, loc]) => {
        if (!styleMap.current[id]) {
          styleMap.current[id] = {
            color: getRandomColor(),
            offset: getRandomOffset(),
          };
        }

        const { color, offset } = styleMap.current[id];
        const position = [loc.lat + offset[0], loc.lng + offset[1]];

        const icon = L.divIcon({
          className: "custom-marker", // Tailwind styling applied below
          html: `
            <div class="w-14px h-14px rounded-full border border-white shadow-md"
              style="background-color: ${color};"></div>
          `,
        });

        return (
          <Marker key={id} position={position} icon={icon}>
            <Tooltip
              permanent
              direction="bottom"
              offset={[0, 8]}
              className="!p-0 !bg-transparent !border-none !shadow-none user-marker-label"
            >
              <div className="bg-white text-gray-900 px-2 py-[2px] rounded text-xs font-medium shadow-sm border border-gray-200">
                {loc.userName || "Unknown"}
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
