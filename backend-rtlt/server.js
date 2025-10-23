import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import cors from "cors";
import { requireAuth } from "./middleware/authMiddleware.js";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Connect MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => {
    console.error("❌ Failed to connect to MongoDB:", err.message || err);
    process.exit(1); // Exit if DB connection fails
  });
``
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
