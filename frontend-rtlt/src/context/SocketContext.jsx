// handles the raw socket connection
import React, { createContext, useContext, useEffect, useMemo } from "react";
import { socket } from "../socket/socket";

const SocketContext = createContext(null);

export function SocketProvider({ children }) {
  useEffect(() => {
    // Ensure socket is available and connected when provider mounts
    if (!socket) return;
    if (!socket.connected) socket.connect();

    const onConnect = () => console.log("Socket connected (provider):", socket.id);
    const onDisconnect = () => console.log("Socket disconnected (provider)");

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      // Note: do not disconnect socket here — leaving lifecycle to app
    };
  }, []);

  const value = useMemo(() => ({
    socket,
    emit: (event, payload) => socket.emit(event, payload),
    on: (event, handler) => socket.on(event, handler),
    off: (event, handler) => socket.off(event, handler),
    connect: () => socket.connect(),
    disconnect: () => socket.disconnect(),
  }), []);

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}

export function useSocket() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error("useSocket must be used within a SocketProvider");
  return ctx;
}

export default SocketContext;
