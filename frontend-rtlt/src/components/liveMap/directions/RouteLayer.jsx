import React, { useEffect } from "react";
import L from "leaflet";
import { Marker, Polyline, useMap } from "react-leaflet";

export default function RouteLayer({ route }) {
  const map = useMap();

  useEffect(() => {
    if (!route?.coordinates?.length) return;

    const bounds = L.latLngBounds(route.coordinates);
    map.fitBounds(bounds, { padding: [48, 48] });
  }, [route, map]);

  if (!route?.coordinates?.length) return null;

  return (
    <>
      <Polyline
        positions={route.coordinates}
        pathOptions={{
          color: "#2563eb",
          weight: 5,
          opacity: 0.85,
        }}
      />

      <Marker position={route.start} />
      <Marker position={route.end} />
    </>
  );
}
