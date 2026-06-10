import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

function buildCurrentLocationIcon(heading) {
  const hasHeading = Number.isFinite(heading);
  const rotation = hasHeading ? heading : 0;

  return L.divIcon({
    className: "current-location-marker",
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        transform: rotate(${rotation}deg);
        transition: transform 180ms ease-out;
      ">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(37, 99, 235, 0.14);
          border: 2px solid rgba(37, 99, 235, 0.35);
          box-shadow: 0 0 0 10px rgba(37, 99, 235, 0.08);
        "></div>
        <div style="
          position: absolute;
          left: 50%;
          top: 1px;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 8px solid transparent;
          border-right: 8px solid transparent;
          border-bottom: 16px solid #2563eb;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.25));
        "></div>
        <div style="
          position: absolute;
          left: 50%;
          top: 14px;
          transform: translateX(-50%);
          width: 9px;
          height: 9px;
          border-radius: 9999px;
          background: #ffffff;
          border: 2px solid #2563eb;
        "></div>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
}

export default function CurrentLocationMarker({ currentLocation, heading }) {
  if (!currentLocation) return null;

  return (
    <Marker
      position={[currentLocation.lat, currentLocation.lng]}
      icon={buildCurrentLocationIcon(heading)}
    >
      <Tooltip
        permanent
        direction="top"
        offset={[0, -10]}
        className="!p-0 !bg-transparent !border-none !shadow-none"
      >
        <div className="rounded-full bg-blue-600 px-2 py-1 text-xs font-semibold text-white shadow-md">
          You
        </div>
      </Tooltip>
    </Marker>
  );
}
