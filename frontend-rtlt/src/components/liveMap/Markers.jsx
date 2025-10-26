// src/components/liveMap/Markers.jsx
import React from "react";
import { Marker, Popup } from "react-leaflet";

export default function Markers({ locations }) {
  return (
    <>
      {Object.entries(locations).map(([id, loc]) => (
        <Marker key={id} position={[loc.lat, loc.lng]}>
          <Popup>{loc.userName || id}</Popup>
        </Marker>
      ))}
    </>
  );
}
