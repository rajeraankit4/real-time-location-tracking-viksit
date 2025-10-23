import jwt from "jsonwebtoken";

const OTP_STORE = {}; // temporary memory store
const JWT_SECRET = process.env.JWT_SECRET; // replace with env variable

export const requestOtp = (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email required" });

  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit
  OTP_STORE[email] = otp;

  console.log(`OTP for ${email}: ${otp}`); // For demo
  res.json({ message: "OTP sent (check console)" });
};

export const verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: "Email and OTP required" });

  if (OTP_STORE[email] && OTP_STORE[email].toString() === otp.toString()) {
    delete OTP_STORE[email]; // OTP used

    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "7d" });
    return res.json({ message: "Login successful", token });
  } else {
    return res.status(400).json({ error: "Invalid OTP" });
  }
};

export const googleCallback = (req, res) => {
  try {
    const FRONTEND_URL = (process.env.FRONTEND_URL || "http://localhost:3000").replace(/\/$/, "");
    const token = jwt.sign(
      { id: req.user._id || req.user.id, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`${FRONTEND_URL}/oauth-success?token=${token}`);
  } catch (err) {
    console.error("Error creating JWT or redirecting:", err);
    res.status(500).send("Authentication succeeded but failed to redirect.");
  }
};
