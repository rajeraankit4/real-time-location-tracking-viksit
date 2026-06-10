// src/components/liveMap/UserLocationMarkers.jsx
import React, { useRef } from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

const getRandomColor = () => {
  const colors = ["red", "blue", "green", "orange", "purple", "cyan"];
  return colors[Math.floor(Math.random() * colors.length)];
};

const getRandomOffset = () => [
  (Math.random() - 0.5) * 0.0002,
  (Math.random() - 0.5) * 0.0002,
];

function buildUserIcon(color, heading) {
  const rotation = Number.isFinite(heading) ? heading : 0;

  return L.divIcon({
    className: "custom-marker",
    html: Number.isFinite(heading)
      ? `<div style="
          position: relative;
          width: 18px;
          height: 18px;
          transform: rotate(${rotation}deg);
          transition: transform 180ms ease-out;
        ">
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: ${color};
            opacity: 0.22;
            border: 2px solid white;
          "></div>
          <div style="
            position: absolute;
            left: 50%;
            top: -2px;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 5px solid transparent;
            border-right: 5px solid transparent;
            border-bottom: 10px solid ${color};
            filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
          "></div>
        </div>`
      : `<div style="
          background-color: ${color};
          width: 14px;
          height: 14px;
          border-radius: 50%;
          border: 2px solid white;
        "></div>`,
  });
}

export default function UserLocationMarkers({ locations, currentUserId, currentUserName }) {
  const styleMap = useRef({}); // stores color + offset per user

  return (
    <>
      {Object.entries(locations).map(([id, loc]) => {
        if ((currentUserId && id === currentUserId) || (currentUserName && loc.userName === currentUserName)) return null;

        // assign style once per user
        if (!styleMap.current[id]) {
          styleMap.current[id] = {
            color: getRandomColor(),
            offset: getRandomOffset(),
          };
        }

        const { color, offset } = styleMap.current[id];
        const position = [loc.lat + offset[0], loc.lng + offset[1]];

        const icon = buildUserIcon(color, loc.heading);

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
