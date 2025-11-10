// src/components/liveMap/LiveMap.jsx
import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, useMapEvent } from "react-leaflet";
import Markers from "./Markers";
import AddMarkerInput from "./AddMarkerInput";
import { useRoom } from "../../context/RoomContext";
import { useSocket } from "../../context/SocketContext";
import { Marker } from "react-leaflet";
import { runAppCleanup } from "../../utils/runAppCleanup"; // added import

function MapClickHandler({ setPendingMarker }) {
  useMapEvent("click", (e) => {
    setPendingMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

export default function LiveMap({ defaultCenter = [30.7333, 76.7794], defaultZoom = 13 }) {
  const { room, userName, isAddingMarker, setIsAddingMarker, markers, locations, sendLocation, addMarker } = useRoom();
  const [pendingMarker, setPendingMarker] = useState(null);
  const [label, setLabel] = useState("");
  const { emit } = useSocket();

  useEffect(() => {
    let currentCoords = null;
    let hasSentFirst = false;

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        currentCoords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        console.log("Updated currentCoords:", currentCoords);

        if (!hasSentFirst) {
          sendLocation(currentCoords);
          hasSentFirst = true;
        }
      },
      (err) => console.error("Geolocation error:", err),
      { enableHighAccuracy: true }
    );

    const interval = setInterval(() => {
      console.log("location sent", currentCoords);
      if (currentCoords) {
        sendLocation(currentCoords);
      }
    }, 5000);

    return () => {
      navigator.geolocation.clearWatch(watch);
      clearInterval(interval);
    };
  }, []); // <--- FIX




  // Emit leaveRoom and run broader cleanup when this component unmounts
  useEffect(() => {
    return () => {
      runAppCleanup({
        emit,
        setIsAddingMarker,
        setPendingMarker,
        setLabel,
        // you can pass additional reset functions from context here when available:
        // resetMarkers, resetLocations, resetRoomState, resetUser, clearGeolocationWatchId
      });
    };
  }, [emit, setIsAddingMarker, setPendingMarker, setLabel]);

  return (
    <>

    <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "100vh", width: "100%" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {isAddingMarker && !pendingMarker && (
        <MapClickHandler setPendingMarker={setPendingMarker} />
      )}

      {pendingMarker && (
        <Marker position={[pendingMarker.lat, pendingMarker.lng]} />
      )}

      <AddMarkerInput
        pendingMarker={pendingMarker}
        label={label}
        setLabel={setLabel}
        
        onSave={() => {
          addMarker({
            id: `${userName || "anon"}-${Date.now()}`,
            lat: pendingMarker.lat,
            lng: pendingMarker.lng,
            label: label.trim() || "Unnamed",
            createdAt: Date.now(),
          });
          setPendingMarker(null);
          setLabel("");
          setIsAddingMarker(false);
        }}
        
        onCancel={() => {
          setPendingMarker(null);
          setLabel("");
          setIsAddingMarker(false);
        }}
      />

      <Markers locations={locations} markers={markers} />
    </MapContainer>
    </>
  );
}