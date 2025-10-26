// src/components/liveMap/Markers.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";

export default function Markers({ locations, userName }) {
  return (
    <>
      {Object.entries(locations).map(([id, loc]) => (
        <Marker key={id} position={[loc.lat, loc.lng]}>
          <Popup>{userName}</Popup>
        </Marker>
      ))}
    </>
  );
}
