import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';

// Fix default marker icons
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});

const socket = io('http://localhost:5000'); // backend URL

export default function CommonMap() {
  const userName = 'Ankit'; // replace with logged-in user
  const [locations, setLocations] = useState({});
  const [markers, setMarkers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [emojis, setEmojis] = useState([]);
  const [socketId, setSocketId] = useState(null);

  // Join room and socket listeners
  useEffect(() => {
    socket.emit('joinRoom', { room: 'common', userName });

    socket.on('connect', () => setSocketId(socket.id));

    socket.on('receiveLocation', ({ userId, location }) => {
      setLocations((prev) => ({ ...prev, [userId]: location }));
    });

    socket.on('receiveMessage', (msg) => setMessages((prev) => [...prev, msg]));
    socket.on('receiveEmoji', ({ emoji }) => setEmojis((prev) => [...prev, emoji]));
    socket.on('newMarker', (marker) => setMarkers((prev) => [...prev, marker]));

    return () => {
      socket.off('connect');
      socket.off('receiveLocation');
      socket.off('receiveMessage');
      socket.off('receiveEmoji');
      socket.off('newMarker');
    };
  }, []);

  // Track current location
  useEffect(() => {
    const watch = navigator.geolocation.watchPosition(
      (pos) =>
        socket.emit('sendLocation', {
          room: 'common',
          location: { lat: pos.coords.latitude, lng: pos.coords.longitude },
        }),
      (err) => console.error(err),
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  function MapCenter({ userLocation }) {
    const map = useMap();
    if (userLocation) map.setView([userLocation.lat, userLocation.lng], 13);
    return null;
  }

  // Action functions
  const sendMessage = (message) =>
    socket.emit('sendMessage', { room: 'common', userName, message });
  const sendEmoji = (emoji) => socket.emit('sendEmoji', { room: 'common', emoji });
  const addMarker = (coords, label) =>
    socket.emit('addMarker', { room: 'common', userName, coords, label });

  return (
    <div className="relative h-screen w-full">
      <MapContainer center={[23.1, 77.2]} zoom={5} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User locations */}
        {Object.entries(locations).map(([id, loc]) => (
          <Marker key={id} position={[loc.lat, loc.lng]}>
            <Popup>{id === socketId ? 'You' : id}</Popup>
          </Marker>
        ))}

        {/* Temporary markers */}
        {markers.map((m, i) => (
          <Marker key={i} position={[m.coords.lat, m.coords.lng]}>
            <Popup>{m.label}</Popup>
          </Marker>
        ))}

        <MapCenter userLocation={locations[socketId]} />
      </MapContainer>

  {/* Chat panel */}
      <div
        className="absolute top-4 right-4 bg-white border p-2 max-h-96 w-72 overflow-auto z-50 pointer-events-auto"
        style={{ zIndex: 9999 }}
      >
        <h3>Chat</h3>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.userName}:</b> {msg.message}
          </div>
        ))}
        <input
          type="text"
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              sendMessage(e.target.value);
              e.target.value = '';
            }
          }}
          className="border p-1 w-full mt-1"
        />
        <button onClick={() => sendEmoji('🔥')} className="mt-1 bg-yellow-400 px-2 rounded">
          Send Emoji 🔥
        </button>
      </div>

  {/* Emoji panel */}
      <div
        className="absolute bottom-4 left-4 bg-white border p-2 max-h-96 w-48 overflow-auto z-50 pointer-events-auto"
        style={{ zIndex: 9999 }}
      >
        <h3>Emojis</h3>
        {emojis.map((e, i) => (
          <span key={i} className="text-2xl mr-1">
            {e}
          </span>
        ))}
      </div>

  {/* Marker buttons */}
  <div className="absolute top-4 left-4 flex flex-col gap-2 z-50 pointer-events-auto" style={{ zIndex: 9999 }}>
        <button onClick={() => addMarker({ lat: 23.15, lng: 77.25 }, 'Nice view!')} className="bg-green-500 text-white px-3 py-1 rounded">
          Add Marker
        </button>
      </div>
    </div>
  );
}
