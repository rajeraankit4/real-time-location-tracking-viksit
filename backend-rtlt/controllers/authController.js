import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import { mailer } from "../utils/mail.js";
const OTP_STORE = {}; // temporary memory store

export const requestOtp = async (req, res) => {
  try {
    const rawEmail = req.body.email;
    if (!rawEmail)
      return res.status(400).json({ error: "Email required" });

    const email = rawEmail.toLowerCase().trim();

    const otp = Math.floor(100000 + Math.random() * 900000);
    OTP_STORE[email] = {
      otp,
      expiresAt: Date.now() + 10 * 60 * 1000  // 10 minutes
    };


    // Send mail
    await mailer.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your OTP Code",
      text: `Your OTP is ${otp}. It is valid for 10 minutes.`,
    });

    res.json({ message: "OTP sent successfully" });

  } catch (err) {
    console.error("Error sending email:", err);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

export const verifyOtp = async (req, res) => {
  const { email: rawEmail, otp } = req.body;

  if (!rawEmail || !otp)
    return res.status(400).json({ error: "Email and OTP required" });

  const email = rawEmail.toLowerCase().trim();

  const record = OTP_STORE[email];

  if (!record)
    return res.status(400).json({ error: "OTP not found" });

  // Check expiry
  if (Date.now() > record.expiresAt) {
    delete OTP_STORE[email];
    return res.status(400).json({ error: "OTP expired" });
  }

  // Check OTP match as string (safe)
  if (String(record.otp) !== String(otp)) {
    return res.status(400).json({ error: "Invalid OTP" });
  }

  // OTP success → remove from memory
  delete OTP_STORE[email];

  // Check if user exists
  let user = await User.findOne({ email });

  if (user) {
    const token = createJwtForUser(user);
    return res.json({ token, newUser: false });
  }

  // New user → ask for name later
  return res.json({ newUser: true, email });
};


export const createUser = async (req, res) => {
  const { email: rawEmail, name } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!rawEmail || !name) return res.status(400).json({ error: "Email and name required" });

  const email = rawEmail.toLowerCase().trim();

  try {
  let existingUser = await User.findOne({ email });
  if (existingUser) return res.status(400).json({ error: "User already exists" });

  const newUser = await User.create({ email, name });
  // create token via helper so payload is consistent
  const token = createJwtForUser(newUser);

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

export const googleCallback = (req, res) => {
  try {
    const FRONTEND_URL = (process.env.FRONTEND_URL).replace(/\/$/, "");
    // use helper to sign token from profile/user
    const token = createJwtForUser(req.user);

    res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (err) {
    console.error("Error creating JWT or redirecting:", err);
    res.status(500).send("Authentication succeeded but failed to redirect.");
  }
};

export const createJwtForUser = (user) => {
  const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret";
  if (!process.env.JWT_SECRET) {
    // Don't throw in development/demo flows, but warn so maintainers notice.
    console.warn("Warning: JWT_SECRET is not set. Using development fallback secret.");
  }

  const payload = {
    id: user && (user._id ? String(user._id) : user.id) || null,
    email: user && user.email,
    name: user && user.name,
  };

  // Token lifetime: 7 days
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
};