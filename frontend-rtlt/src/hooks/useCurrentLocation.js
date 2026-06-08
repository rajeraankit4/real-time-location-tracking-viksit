import { useEffect, useRef, useState } from "react";

export default function useCurrentLocation(sendLocation) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [locationError, setLocationError] = useState("");
  const currentLocationRef = useRef(null);
  const hasSentFirstLocationRef = useRef(false);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported in this browser.");
      return undefined;
    }

    const watch = navigator.geolocation.watchPosition(
      (pos) => {
        const nextLocation = {
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        };

        currentLocationRef.current = nextLocation;
        setCurrentLocation(nextLocation);

        if (!hasSentFirstLocationRef.current) {
          sendLocation(nextLocation);
          hasSentFirstLocationRef.current = true;
        }
      },
      (err) => {
        console.error("Geolocation error:", err);
        setLocationError("Location access is needed for directions.");
      },
      { enableHighAccuracy: true }
    );

    const interval = setInterval(() => {
      if (currentLocationRef.current) {
        sendLocation(currentLocationRef.current);
      }
    }, 5000);

    return () => {
      navigator.geolocation.clearWatch(watch);
      clearInterval(interval);
    };
  }, [sendLocation]);

  return { currentLocation, currentLocationRef, locationError };
}
