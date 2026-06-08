import React from "react";
import { Marker, Tooltip } from "react-leaflet";

export default function UserAddedMarkers({ markers, onMarkerClick, selectedMarkerId }) {
  return (
    <>
      {markers.map((m) => {
        const key = m.id || `${m.lat}-${m.lng}-${m.createdAt || ''}`;
        const position = [m.lat, m.lng];
        const isSelected = selectedMarkerId && selectedMarkerId === key;

        return (
          <Marker
            key={key}
            position={position}
            eventHandlers={{
              click: () => onMarkerClick?.(m, key),
            }}
          >
            <Tooltip
              permanent
              direction="bottom"
              offset={[-15, 25]}
              className={isSelected ? "!z-[1200]" : ""}
            >
              <div className={isSelected ? "font-semibold text-blue-700" : ""}>
                {m.label || "Marker"}
              </div>
              <div>- {m.addedBy || "Unknown"}</div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
