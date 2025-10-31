// src/components/liveMap/LiveMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import Markers from "./Markers";
import useLiveMap from "../../hooks/useLiveMap";

function MapClickHandler({ onMapClick }) {
  // register click on the map and forward to parent
  useMapEvent("click", (e) => {
    console.log("🖱️ Map clicked at:", e.latlng);
    if (onMapClick) onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

export default function LiveMap({ room, userName, onMapClick, isAddingMarker, defaultCenter = [30.775512, 76.798591

], defaultZoom = 15 }) {
  const { locations, markers, sendLocation } = useLiveMap(room, userName);
//   const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        // setUserLocation(coords);
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
      {isAddingMarker && onMapClick && <MapClickHandler onMapClick={onMapClick} />}

  <Markers locations={locations} markers={markers} userName={userName} />
    </MapContainer>
  );
}
