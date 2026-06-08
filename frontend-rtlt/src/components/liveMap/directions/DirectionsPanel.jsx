import React from "react";
import { formatDistance, formatDuration } from "../../../utils/routing";

export default function DirectionsPanel({
  currentLocation,
  route,
  routeLoading,
  routeError,
  onClear,
}) {
  return (
    <div className="absolute top-4 right-4 z-[1000] w-80 max-w-[calc(100vw-2rem)] rounded-xl bg-white/95 p-4 shadow-xl backdrop-blur">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Directions</h3>
          <p className="text-xs text-gray-500">
            Click a custom marker to route from your current location.
          </p>
        </div>

        {route && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
          >
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-gray-600">Current location</span>
          <span className="font-medium text-gray-900">
            {currentLocation ? "Detected" : "Waiting..."}
          </span>
        </div>

        <div className="flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
          <span className="text-gray-600">Status</span>
          <span className="font-medium text-gray-900">
            {routeLoading ? "Loading route..." : route ? "Route ready" : "Idle"}
          </span>
        </div>

        {route && (
          <>
            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
              <span className="text-blue-700">Distance</span>
              <span className="font-semibold text-blue-900">{formatDistance(route.distance)}</span>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2">
              <span className="text-blue-700">ETA</span>
              <span className="font-semibold text-blue-900">{formatDuration(route.duration)}</span>
            </div>
          </>
        )}

        {routeError && (
          <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">
            {routeError}
          </div>
        )}
      </div>
    </div>
  );
}
