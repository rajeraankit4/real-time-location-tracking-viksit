import { useState } from "react";
import { fetchRoute } from "../utils/routing";

export default function useRouteDirections(currentLocationRef) {
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);

  const handleMarkerClick = async (marker, markerId) => {
    if (!currentLocationRef.current) {
      setRouteError("Waiting for your current location...");
      return;
    }

    setSelectedMarkerId(markerId);
    setRouteLoading(true);
    setRouteError("");

    try {
      const nextRoute = await fetchRoute(currentLocationRef.current, marker);
      setRoute(nextRoute);
    } catch (error) {
      console.error("Route error:", error);
      setRoute(null);
      setRouteError(error?.message || "Unable to load directions");
    } finally {
      setRouteLoading(false);
    }
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteError("");
    setSelectedMarkerId(null);
  };

  return {
    route,
    routeLoading,
    routeError,
    selectedMarkerId,
    handleMarkerClick,
    clearRoute,
  };
}
