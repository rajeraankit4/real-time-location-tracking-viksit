import { useEffect, useRef, useState } from "react";

const HEADING_UPDATE_INTERVAL_MS = 500;

function normalizeHeading(value) {
  if (!Number.isFinite(value)) return null;
  const next = value % 360;
  return next < 0 ? next + 360 : next;
}

function extractHeading(event) {
  if (typeof event?.webkitCompassHeading === "number") {
    return normalizeHeading(event.webkitCompassHeading);
  }

  if (typeof event?.alpha === "number") {
    return normalizeHeading(360 - event.alpha);
  }

  return null;
}

export default function useDeviceCompass() {
  const [heading, setHeading] = useState(null);
  const [error, setError] = useState("");
  const lastHeadingUpdateAtRef = useRef(0);
  const pendingHeadingRef = useRef(null);
  const pendingTimerRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (!("DeviceOrientationEvent" in window)) {
      setError("Compass is not supported in this browser.");
      return undefined;
    }

    const handleOrientation = (event) => {
      const nextHeading = extractHeading(event);
      if (nextHeading === null) return;

      pendingHeadingRef.current = nextHeading;

      const now = Date.now();
      const elapsed = now - lastHeadingUpdateAtRef.current;

      if (elapsed >= HEADING_UPDATE_INTERVAL_MS) {
        lastHeadingUpdateAtRef.current = now;
        setHeading(nextHeading);
        return;
      }

      if (pendingTimerRef.current) return;

      pendingTimerRef.current = window.setTimeout(() => {
        pendingTimerRef.current = null;
        const latestHeading = pendingHeadingRef.current;
        if (latestHeading === null) return;

        lastHeadingUpdateAtRef.current = Date.now();
        setHeading(latestHeading);
      }, HEADING_UPDATE_INTERVAL_MS - elapsed);
    };

    const startListening = () => {
      window.addEventListener("deviceorientationabsolute", handleOrientation, true);
      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    const stopListening = () => {
      window.removeEventListener("deviceorientationabsolute", handleOrientation, true);
      window.removeEventListener("deviceorientation", handleOrientation, true);
      if (pendingTimerRef.current) {
        window.clearTimeout(pendingTimerRef.current);
        pendingTimerRef.current = null;
      }
    };

    const maybeRequestPermission = async () => {
      const deviceOrientation = window.DeviceOrientationEvent;
      if (typeof deviceOrientation?.requestPermission !== "function") {
        startListening();
        return;
      }

      try {
        const result = await deviceOrientation.requestPermission();
        if (result !== "granted") {
          setError("Compass permission was denied.");
          return;
        }
        startListening();
      } catch (err) {
        console.error("Compass permission error:", err);
        setError("Compass access is unavailable.");
      }
    };

    maybeRequestPermission();

    return () => {
      stopListening();
    };
  }, []);

  return { heading, error };
}
