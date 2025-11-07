export function runAppCleanup(opts = {}) {
  const {
    emit,
    setIsAddingMarker,
    setPendingMarker,
    setLabel,
    resetMarkers,
    resetLocations,
    resetRoomState,
    resetUser,
    clearGeolocationWatchId, // optional number
  } = opts;

  try {
    emit && emit("leaveRoom");
  } catch (e) {
    // ignore
  }

  try {
    if (typeof setIsAddingMarker === "function") setIsAddingMarker(false);
    if (typeof setPendingMarker === "function") setPendingMarker(null);
    if (typeof setLabel === "function") setLabel("");
    if (typeof resetMarkers === "function") resetMarkers([]);
    if (typeof resetLocations === "function") resetLocations([]);
    if (typeof resetRoomState === "function") resetRoomState();
    if (typeof resetUser === "function") resetUser(null);

    if (
      typeof clearGeolocationWatchId === "number" &&
      typeof navigator !== "undefined" &&
      navigator.geolocation &&
      typeof navigator.geolocation.clearWatch === "function"
    ) {
      navigator.geolocation.clearWatch(clearGeolocationWatchId);
    }
  } catch (e) {
    // ignore
  }
}