export async function fetchRoute(from, to) {
  const profiles = ["foot", "driving"];
  let lastError = null;

  for (const profile of profiles) {
    try {
      const url = `https://router.project-osrm.org/route/v1/${profile}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&steps=true`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Routing request failed with status ${response.status}`);
      }

      const data = await response.json();
      const route = data?.routes?.[0];

      if (!route?.geometry?.coordinates?.length) {
        throw new Error("Route geometry was empty");
      }

      return {
        coordinates: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
        distance: route.distance,
        duration: route.duration,
        profile,
        start: [from.lat, from.lng],
        end: [to.lat, to.lng],
      };
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("Unable to calculate a route");
}

export function formatDistance(meters) {
  if (typeof meters !== "number") return "-";
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function formatDuration(seconds) {
  if (typeof seconds !== "number") return "-";
  const minutes = Math.round(seconds / 60);
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins ? `${hours}h ${mins}m` : `${hours}h`;
  }
  return `${minutes} min`;
}
