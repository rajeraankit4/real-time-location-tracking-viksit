import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import passport from "passport";
import jwt from "jsonwebtoken";
import cors from "cors";
import "./passport.js";
import { requireAuth } from "./middleware/authMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("✅ MongoDB connected successfully"))
    .catch(err => {
        console.error("❌ Failed to connect to MongoDB:", err.message || err);
        process.exit(1); // Exit if DB connection fails
    });

// Routes

// Start Google OAuth
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// OAuth callback
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: process.env.FRONTEND_URL}),
  (req, res) => {
    // User authenticated successfully via Passport and req.user is set (from passport.js)
    // Create JWT and redirect back to frontend (FRONTEND_URL from .env, fallback to localhost:3000)
    try {
      const FRONTEND_URL = (process.env.FRONTEND_URL).replace(/\/$/, "");
      const token = jwt.sign(
        { id: req.user._id || req.user.id, email: req.user.email },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // Redirect browser to frontend route with token as query param
      // NOTE: for better security consider setting an httpOnly cookie instead of using query params
      res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}`);
    } catch (err) {
      console.error("Error creating JWT or redirecting:", err);
      // Fallback: send a simple error response
      res.status(500).send("Authentication succeeded but failed to redirect.");
    }
  }
);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
