import express from "express";
import { roomUsers } from "../sockets/socketHandler.js";

const router = express.Router();

// Check if a room exists (synchronously reads in-memory roomUsers)
router.get("/check/:room", (req, res) => {
  const { room } = req.params;
  const exists = roomUsers.has(room);
  res.json({ exists });
});

export default router;
