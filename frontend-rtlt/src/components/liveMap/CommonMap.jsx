import React, { useState, useEffect } from 'react';
import { useMap, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Optional: Fix for default marker icon missing in some environments
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: iconRetinaUrl,
    iconUrl: iconUrl,
    shadowUrl: shadowUrl,
});
// End of optional marker fix

function UserLocationMarker() {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const map = useMap(); // Access the Leaflet map instance

  useEffect(() => {
    // This runs once when the component mounts
    
    // Define event handlers
    function onLocationFound(e) {
      setPosition(e.latlng);
      // Fly to the new location and set a specific zoom level
      map.flyTo(e.latlng, 16); 
      // Optional: Add a circle to show accuracy
      const radius = e.accuracy;
      L.circle(e.latlng, radius).addTo(map);
    }

    function onLocationError(e) {
      console.error(e.message);
      setError(e.message);
    }

    // Attach event listeners
    map.on('locationfound', onLocationFound);
    map.on('locationerror', onLocationError);

    // Request user location (setView: true will automatically center the map)
    map.locate({ setView: false, maxZoom: 16 });

    // Cleanup function to remove event listeners when the component unmounts
    return () => {
      map.off('locationfound', onLocationFound);
      map.off('locationerror', onLocationError);
      // Optional: Stop watching location if you were using map.watch()
      // map.stopLocate(); 
    };
  }, [map]); // Dependency array: only run when 'map' changes (once)

  if (error) {
    return <p>Location error: {error}. Please ensure location services are enabled.</p>;
  }

  // Render a Marker if the position is found, otherwise return null
  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here!</Popup>
    </Marker>
  );
}

export default UserLocationMarker;