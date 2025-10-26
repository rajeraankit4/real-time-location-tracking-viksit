import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
const OTP_STORE = {}; // temporary memory store

export const requestOtp = (req, res) => {
  const rawEmail = req.body.email;
  if (!rawEmail) return res.status(400).json({ error: "Email required" });

  const email = rawEmail.toLowerCase().trim();

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
  OTP_STORE[email] = otp;
  
  console.log(`OTP for ${email}: ${otp}`); // For demo
  res.json({ message: "OTP sent (check console)" });
};

export const verifyOtp = async (req, res) => {
  const { email: rawEmail, otp } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!rawEmail || !otp) return res.status(400).json({ error: "Email and OTP required" });

  const email = rawEmail.toLowerCase().trim();

  if (OTP_STORE[email] && OTP_STORE[email].toString() === otp.toString()) {
    delete OTP_STORE[email];

    let user = await User.findOne({ email });
    if (user) {
      // create token via helper
      const token = createJwtForUser(user);
      return res.json({ token, newUser: false });
    } else {
      return res.json({ newUser: true, email });
    }
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
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
    const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
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