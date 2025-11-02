import React, { useEffect, useState } from "react";
import { socket } from "../../socket/socket";

export default function ConnectedUsers({ room, initialUsers = [] }) {
  const [users, setUsers] = useState(initialUsers || []);

  // Update local users if initialUsers prop changes (from joinSuccess payload)
  useEffect(() => {
    if (initialUsers && initialUsers.length) setUsers(initialUsers);
  }, [initialUsers]);

  useEffect(() => {
    if (!room) return;

    socket.on("roomUsers", (usersInRoom) => {
      setUsers(usersInRoom);
    });

    return () => {
      socket.off("roomUsers");
    };
  }, [room]);

  return (
    <div
      style={{
        position: "absolute",
        top: 75,
        right: 20,
        zIndex: 1100,
        padding: "6px 10px",
        background: "rgba(255, 255, 255, 0.3)",
        backdropFilter: "blur(2px)",             // adds blur
        WebkitBackdropFilter: "blur(6px)",       // Safari support
        borderRadius: "4px",
        boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
        fontSize: "12px",
        lineHeight: "1.3",
        minWidth: "120px",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>
        Connected ({users.length})
      </div>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {users.length === 0 && (
          <li style={{ color: "#666", fontSize: 13 }}>No users</li>
        )}
        {users.map((u, i) => (
          <li
            key={u.userId || i}
            style={{
              fontSize: 13,
              padding: "4px 0",
              borderBottom: "1px solid rgba(0,0,0,0.04)",
            }}
          >
            {u.userName || "Unknown"}
          </li>
        ))}
      </ul>
    </div>
  );
}
