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
            {isSelected && <Tooltip direction="top" permanent offset={[0, -14]}>Selected</Tooltip>}
            <Tooltip permanent direction="bottom" offset={[-15, 25]}>
              {m.label || "Marker"}<br />- {m.addedBy || "Unknown"}
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
