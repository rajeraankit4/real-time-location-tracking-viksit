import express from "express";
import passport from "passport";
import { googleCallback } from "../controllers/authController.js";
import "../passport.js";
import { requestOtp, verifyOtp, createUser} from "../controllers/authController.js";

const router = express.Router();

router.post("/request-otp", requestOtp);
router.post("/verify-otp", verifyOtp);
router.post("/create-user", createUser);

// Start Google OAuth
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// OAuth callback
router.get("/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: process.env.FRONTEND_URL }),
  googleCallback
);

export default router;
