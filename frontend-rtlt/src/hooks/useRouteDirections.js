import { useState } from "react";
import { fetchRoute } from "../utils/routing";

export default function useRouteDirections(currentLocationRef) {
  const [route, setRoute] = useState(null);
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeError, setRouteError] = useState("");
  const [selectedMarkerId, setSelectedMarkerId] = useState(null);
  const [pendingDestination, setPendingDestination] = useState(null);

  const handleMarkerClick = async (marker, markerId) => {
    setSelectedMarkerId(markerId);
    setPendingDestination({ marker, markerId });
    setRouteError("");
  };

  const confirmRoute = async () => {
    if (!pendingDestination?.marker) return;

    if (!currentLocationRef.current) {
      setRouteError("Waiting for your current location...");
      return;
    }

    setRouteLoading(true);
    setRouteError("");

    try {
      const nextRoute = await fetchRoute(currentLocationRef.current, pendingDestination.marker);
      setRoute(nextRoute);
      setPendingDestination(null);
    } catch (error) {
      console.error("Route error:", error);
      setRoute(null);
      setRouteError(error?.message || "Unable to load directions");
    } finally {
      setRouteLoading(false);
    }
  };

  const cancelPendingRoute = () => {
    setPendingDestination(null);
    setRouteError("");
  };

  const clearRoute = () => {
    setRoute(null);
    setRouteError("");
    setSelectedMarkerId(null);
    setPendingDestination(null);
  };

  return {
    route,
    routeLoading,
    routeError,
    selectedMarkerId,
    pendingDestination,
    handleMarkerClick,
    confirmRoute,
    cancelPendingRoute,
    clearRoute,
  };
}
