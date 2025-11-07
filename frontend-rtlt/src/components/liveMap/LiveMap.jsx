// src/components/liveMap/LiveMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import Markers from "./Markers";
import { useRoom } from "../../context/RoomContext";

function MapClickHandler({ setIsAddingMarker, addMarker, userName }) {
  useMapEvent("click", (e) => {
    const marker = {
      id: `${userName || "anon"}-${Date.now()}`,
      lat: e.latlng.lat,
      lng: e.latlng.lng,
      label: "User Marker",
      addedBy: userName,
      createdAt: Date.now(),
    };
    addMarker(marker);
    setIsAddingMarker(false);
  });

  return null;
}

export default function LiveMap({ defaultCenter = [30.775512, 76.798591], defaultZoom = 15 }) {
  const { room, userName, isAddingMarker, setIsAddingMarker, markers, locations, sendLocation, addMarker } = useRoom();

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
      {isAddingMarker && (
        <MapClickHandler
          setIsAddingMarker={setIsAddingMarker}
          addMarker={addMarker}
          userName={userName}
        />
      )}


      <Markers locations={locations} markers={markers} />
    </MapContainer>
  );
}
