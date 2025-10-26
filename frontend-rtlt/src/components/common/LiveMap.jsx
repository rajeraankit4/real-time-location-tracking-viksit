// src/components/liveMap/LiveMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import useLiveMap from "../../hooks/useLiveMap";

export default function LiveMap({ room, userName }) {
  const { locations, sendLocation } = useLiveMap(room, userName);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        sendLocation(coords);
      },
      console.error,
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  return (
    <MapContainer center={[23.1, 77.2]} zoom={5} style={{ height: "100%", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {Object.entries(locations).map(([id, loc]) => (
        <Marker key={id} position={[loc.lat, loc.lng]} />
      ))}
    </MapContainer>
  );
}
