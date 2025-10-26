import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import useLiveMap from "../../hooks/useLiveMap";

export default function CommonMap() {
  const userName = "Ankit"; 
  const room = "common";

  const { locations, sendLocation } = useLiveMap(room, userName);
  const [userLocation, setUserLocation] = useState(null);

  // Track user location
  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLocation(coords);
        sendLocation(coords);
      },
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  // function MapCenter({ userLocation }) {
  //   const map = useMap();
  //   useEffect(() => {
  //     if (userLocation) map.setView([userLocation.lat, userLocation.lng], 15);
  //   }, [userLocation, map]);
  //   return null;
  // }

  return (
    <MapContainer center={[23.1, 77.2]} zoom={5} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* loops over all users in locations and renders one marker per user on the map. */}
      {Object.entries(locations).map(([id, loc]) => ( 
        <Marker key={id} position={[loc.lat, loc.lng]} />
      ))}

      {/* <MapCenter userLocation={userLocation} /> */}
    </MapContainer>
  );
}
