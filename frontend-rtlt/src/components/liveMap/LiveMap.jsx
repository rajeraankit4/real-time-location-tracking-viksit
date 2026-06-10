// src/components/liveMap/LiveMap.jsx
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, useMapEvent } from "react-leaflet";
import Markers from "./Markers";
import AddMarkerInput from "./AddMarkerInput";
import RouteLayer from "./directions/RouteLayer";
import DirectionsPanel from "./directions/DirectionsPanel";
import { useRoom } from "../../context/RoomContext";
import { useSocket } from "../../context/SocketContext";
import useCurrentLocation from "../../hooks/useCurrentLocation";
import useDeviceCompass from "../../hooks/useDeviceCompass";
import useRouteDirections from "../../hooks/useRouteDirections";
import { runAppCleanup } from "../../utils/runAppCleanup";

function MapClickHandler({ setPendingMarker }) {
  useMapEvent("click", (e) => {
    setPendingMarker({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

export default function LiveMap({
  defaultCenter = [30.7333, 76.7794],
  defaultZoom = 13,
}) {
  const { userName, isAddingMarker, setIsAddingMarker, markers, locations, sendLocation, addMarker } = useRoom();
  const [pendingMarker, setPendingMarker] = useState(null);
  const [label, setLabel] = useState("");
  const { emit, socket } = useSocket();
  const { currentLocation, currentLocationRef, locationError } = useCurrentLocation(sendLocation);
  const { heading } = useDeviceCompass();
  const { route, routeLoading, routeError, selectedMarkerId, pendingDestination, handleMarkerClick, confirmRoute, cancelPendingRoute, clearRoute } =
    useRouteDirections(currentLocationRef);
  const currentUserId = socket.id;

  // Emit leaveRoom and run broader cleanup when this component unmounts
  useEffect(() => {
    return () => {
      runAppCleanup({
        emit,
        setIsAddingMarker,
        setPendingMarker,
        setLabel,
      });
    };
  }, [emit, setIsAddingMarker, setPendingMarker, setLabel]);

  return (
    <div className="relative">
      <MapContainer
        center={defaultCenter}
        zoom={defaultZoom}
        style={{ height: "100vh", width: "100%" }}
      >
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

        <Markers
          locations={locations}
          markers={markers}
          onMarkerClick={handleMarkerClick}
          selectedMarkerId={selectedMarkerId}
          currentUserId={currentUserId}
          currentUserName={userName}
          currentLocation={currentLocation}
          heading={heading}
        />

        <RouteLayer route={route} />
      </MapContainer>

      <DirectionsPanel
        currentLocation={currentLocation}
        route={route}
        routeLoading={routeLoading}
        routeError={routeError || locationError}
        pendingDestination={pendingDestination}
        onConfirm={confirmRoute}
        onCancelPending={cancelPendingRoute}
        onClear={clearRoute}
      />
    </div>
  );
}
