// src/components/liveMap/LiveMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import Markers from "./Markers";
import useLiveMap from "../../hooks/useLiveMap";
import { socket } from "../../socket/socket";

function MapClickHandler({ room, userName, isAddingMarker, setIsAddingMarker }) {
  useMapEvent("click", (e) => {
    if (!isAddingMarker) return;

    const marker = {
      id: `${userName || "anon"}-${Date.now()}`,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      label: "User Marker",
      addedBy: userName,
      createdAt: Date.now(),
    };

    console.log(`📤 LiveMap emitting addMarker by ${userName}:`, marker);
    socket.emit("addMarker", { room, marker, addedBy: userName });
    setIsAddingMarker(false);
  });

  return null;
}

export default function LiveMap({ room, userName, isAddingMarker, setIsAddingMarker, initialMarkers = [], defaultCenter = [30.775512, 76.798591], defaultZoom = 15 }) {
  const { locations, markers, sendLocation } = useLiveMap(room, userName, initialMarkers);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        sendLocation(coords); 
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );

    return () => navigator.geolocation.clearWatch(watch);
  }, [sendLocation]);

  return (
    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* only enable map click listener while in add-marker mode */}
      <MapClickHandler room={room} userName={userName} isAddingMarker={isAddingMarker} setIsAddingMarker={setIsAddingMarker} />

      <Markers locations={locations} markers={markers} userName={userName} />
    </MapContainer>
  );
}
