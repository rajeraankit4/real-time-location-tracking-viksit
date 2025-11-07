// src/components/liveMap/UserAddedMarkers.jsx
import React from "react";
import { Marker, Popup, Tooltip } from "react-leaflet";
import L from "leaflet";

export default function UserAddedMarkers({ markers }) {
  return (
    <>
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
             <Tooltip
              permanent
              direction="bottom"
              offset={[0, 6]}
              className="user-marker-label"
            >
                {m.label || "Marker"}
                <br />
                {m.addedBy || "Unknown"}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
