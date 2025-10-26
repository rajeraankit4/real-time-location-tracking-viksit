// src/components/liveMap/LiveMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import Markers from "./Markers";
import MapCenter from "./MapCenter";
import useLiveMap from "../../hooks/useLiveMap";

export default function LiveMap({ room, userName, defaultCenter = [23.1, 77.2], defaultZoom = 5 }) {
  const { locations, sendLocation } = useLiveMap(room, userName);
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

      <Markers locations={locations} />
      {/* <MapCenter location={userLocation} /> */}
    </MapContainer>
  );
}
