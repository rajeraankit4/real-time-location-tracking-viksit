// src/components/liveMap/Markers.jsx
import React from "react";
import UserLocationMarkers from "./UserLocationMarkers";
import UserAddedMarkers from "./UserAddedMarkers";

export default function Markers({ locations, markers }) {
  return (
    <>
      <UserLocationMarkers locations={locations} />
      <UserAddedMarkers markers={markers} />
    </>
  );
}
