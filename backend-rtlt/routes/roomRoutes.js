import express from "express";
import { roomData } from "../sockets/socketHandler.js";

const router = express.Router();

// Check if a room exists (reads in-memory roomData which tracks created rooms)
router.get("/check/:room", (req, res) => {
  const { room } = req.params;
  const exists = roomData.has(room);
  res.json({ exists });
});

export default router;
