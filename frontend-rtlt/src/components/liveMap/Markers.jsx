// src/components/liveMap/Markers.jsx
import React from "react";
import UserLocationMarkers from "./UserLocationMarkers";
import UserAddedMarkers from "./UserAddedMarkers";

export default function Markers({ locations, markers, onMarkerClick, selectedMarkerId }) {
  return (
    <>
      <UserLocationMarkers locations={locations} />
      <UserAddedMarkers
        markers={markers}
        onMarkerClick={onMarkerClick}
        selectedMarkerId={selectedMarkerId}
      />
    </>
  );
}
