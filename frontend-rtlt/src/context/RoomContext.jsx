// handles all room-specific logic (users, markers, locations) using that socket
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useSocket } from "./SocketContext";

const RoomContext = createContext(null);

export function RoomProvider({ room, userName, initialUsers = [], initialMarkers = [], children }) {
  const { socket, on, off, emit, connect } = useSocket();
  const [users, setUsers] = useState(initialUsers || []);
  const [markers, setMarkers] = useState(initialMarkers || []);
  const [isAddingMarker, setIsAddingMarker] = useState(false);
  const [locations, setLocations] = useState({});

  useEffect(() => {
    // Keep internal state in sync if parent passes new initialUsers/initialMarkers
    setUsers(initialUsers || []);
    setMarkers(initialMarkers || []);

    // Ensure socket is connected
    if (!socket.connected) connect();

    // Handlers
    const handleRoomUsers = (list) => {
      if (!list) return;
      setUsers(list);
    };

    const handleUserJoined = ({ userId, userName: joinedName }) => {
      setUsers((prev) => [...prev.filter((u) => u.id !== userId), { id: userId, userName: joinedName }]);
    };

    const handleUserLeft = ({ userId }) => {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      // Remove last known location for the user so their marker disappears
      setLocations((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    };

    const handleInitialMarkers = ({ markers: initial }) => {
      if (!initial) return;
      setMarkers(initial || []);
    };

    const handleMarkerAdded = ({ marker }) => {
      if (!marker) return;
      setMarkers((prev) => (marker.id && prev.some((m) => m.id === marker.id) ? prev : [...prev, marker]));
    };

    const handleReceiveLocation = ({ userId, location, userName: locUser }) => {
      setLocations((prev) => ({ ...prev, [userId]: { ...location, userName: locUser } }));
    };

    // Register listeners
    on("roomUsers", handleRoomUsers);
    on("userJoined", handleUserJoined);
    on("userLeft", handleUserLeft);
    on("initialMarkers", handleInitialMarkers);
    on("markerAdded", handleMarkerAdded);
    on("receiveLocation", handleReceiveLocation);

    return () => {
      off("roomUsers", handleRoomUsers);
      off("userJoined", handleUserJoined);
      off("userLeft", handleUserLeft);
      off("initialMarkers", handleInitialMarkers);
      off("markerAdded", handleMarkerAdded);
      off("receiveLocation", handleReceiveLocation);
    };
  }, [socket, on, off, connect]);

  // Actions
  const join = (password) => emit("joinRoom", { room, userName, password });
  const addMarker = (marker) => emit("addMarker", { room, marker, addedBy: userName });
  const sendLocation = (location) => emit("sendLocation", { room, location });

  const value = useMemo(
    () => ({
      room,
      userName,
      users,
      markers,
      locations,
      isAddingMarker,
      setIsAddingMarker,
      join,
      addMarker,
      sendLocation,
    }),
    [room, userName, users, markers, locations, isAddingMarker]
  );

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}

export function useRoom() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error("useRoom must be used within a RoomProvider");
  return ctx;
}

export default RoomContext;
