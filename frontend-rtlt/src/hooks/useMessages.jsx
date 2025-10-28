import { useEffect, useState } from "react";
import { socket } from "../socket/socket";

export default function useMessages(room) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const handleReceive = (msg) => {
      // Normalize different possible payload shapes
      const userName = msg?.userName;
      const message = msg?.message;

      const normalized = { userName, message };

      setMessages((prev) => {
        const next = [...prev, normalized];
        return next.slice(-5);
      });
    };

    socket.on("receiveMessage", handleReceive);

    return () => {
      socket.off("receiveMessage", handleReceive);
    };
  }, [room]);

  return messages;
}
