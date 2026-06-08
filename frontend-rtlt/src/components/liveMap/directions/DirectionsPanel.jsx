import React from "react";
import { formatDistance, formatDuration } from "../../../utils/routing";

export default function DirectionsPanel({
  currentLocation,
  route,
  routeLoading,
  routeError,
  pendingDestination,
  onConfirm,
  onCancelPending,
  onClear,
}) {
  const markerLabel = pendingDestination?.marker?.label || "this marker";

  return (
    <div className="absolute bottom-[14px] right-5 z-[1100] py-[6px] px-[10px] bg-white/30 backdrop-blur-[2px] rounded shadow-[0_1px_4px_rgba(0,0,0,0.2)] text-[12px] leading-[1.3] min-w-[120px] w-80 max-w-[calc(100vw-2rem)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Directions</h3>
          {!route && (
            <p className="text-xs text-gray-500">
              Click a custom marker to route from your current location.
            </p>
          )}
        </div>

        {route && !pendingDestination && (
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
        {pendingDestination && (
          <div
            style={{
              padding: "6px 10px",
              background: "rgba(255, 255, 255, 0.3)",
              backdropFilter: "blur(2px)",
              WebkitBackdropFilter: "blur(6px)",
              borderRadius: "4px",
              boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
            }}
          >
            <div className="font-medium text-gray-900">
              Get directions to "{markerLabel}"?
            </div>
            <div className="mt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onConfirm}
                className="rounded-md bg-blue-600 px-2 py-1 text-xs font-medium text-white hover:bg-blue-700"
              >
                Get Direction
              </button>
              <button
                type="button"
                onClick={onCancelPending}
                className="rounded-md bg-gray-100 px-2 py-1 text-xs font-medium text-gray-700 hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {route && (
          <>
            <div
              style={{
                padding: "6px 10px",
                background: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "4px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
              className="flex items-center justify-between"
            >
              <span className="text-blue-700">Distance</span>
              <span className="font-semibold text-blue-900">{formatDistance(route.distance)}</span>
            </div>

            <div
              style={{
                padding: "6px 10px",
                background: "rgba(255, 255, 255, 0.3)",
                backdropFilter: "blur(2px)",
                WebkitBackdropFilter: "blur(6px)",
                borderRadius: "4px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
              }}
              className="flex items-center justify-between"
            >
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
