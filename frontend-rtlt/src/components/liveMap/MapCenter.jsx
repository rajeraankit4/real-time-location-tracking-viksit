// src/components/liveMap/MapCenter.jsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";

export default function MapCenter({ location, zoom = 15 }) {
  const map = useMap();

  useEffect(() => {
    if (location) map.setView([location.lat, location.lng], zoom);
  }, [location, map, zoom]);

  return null;
}
