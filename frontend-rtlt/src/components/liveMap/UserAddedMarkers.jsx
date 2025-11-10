import React from "react";
import { Marker, Tooltip } from "react-leaflet";

export default function UserAddedMarkers({ markers }) {
  return (
    <>
      {markers.map((m) => {
        const key = m.id || `${m.lat}-${m.lng}-${m.createdAt || ''}`;
        const position = [m.lat, m.lng];

        return (
          <Marker key={key} position={position}>
            <Tooltip permanent direction="bottom" offset={[-15, 25]}>
              {m.label || "Marker"}<br />- {m.addedBy || "Unknown"}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
