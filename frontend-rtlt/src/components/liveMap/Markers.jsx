// src/components/liveMap/Markers.jsx
import React from "react";
import UserLocationMarkers from "./UserLocationMarkers";
import UserAddedMarkers from "./UserAddedMarkers";
import CurrentLocationMarker from "./CurrentLocationMarker";

export default function Markers({
  locations,
  markers,
  onMarkerClick,
  selectedMarkerId,
  currentUserId,
  currentUserName,
  currentLocation,
  heading,
}) {
  return (
    <>
      <CurrentLocationMarker currentLocation={currentLocation} heading={heading} />
      <UserLocationMarkers
        locations={locations}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
      />
      <UserAddedMarkers
        markers={markers}
        onMarkerClick={onMarkerClick}
        selectedMarkerId={selectedMarkerId}
      />
    </>
  );
}
