import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

export default function LoginForm({ onRequestOtp }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [newUser, setNewUser] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const requestOtp = async () => {
    if (!validateEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.post(`${baseUrl.replace(/\/$/, "")}/api/auth/request-otp`, { email });

      if (typeof onRequestOtp === "function") onRequestOtp();
      setStep(2);

      toast.success("OTP sent successfully!");
    } catch (err) {
      toast.error("Failed to send OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(
        `${baseUrl.replace(/\/$/, "")}/api/auth/verify-otp`,
        { email, otp }
      );

      if (res.data.newUser) {        
        setNewUser(true);
      } else {
        toast.success("Login successful!");
        localStorage.setItem("token", res.data.token);

        navigate("/dashboard")
      }
    } catch (err) {
      toast.error("Invalid or expired OTP. Try again.");
    }
  };


  const createUser = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${baseUrl.replace(/\/$/, "")}/api/auth/create-user`, { email, name });
      localStorage.setItem("token", res.data.token);
      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (err) {
      // console.error(err);
      toast.error("Error creating user");
    }
  };

  return (
    <div className="space-y-3">
      {step === 1 && (
        <div className="space-y-2">
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            type="email"
          />
          <button
            onClick={requestOtp}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 "
          >
            Request OTP
          </button>
        </div>
      )}

      {step === 2 && !newUser && (
        <div className="space-y-2">
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button
            onClick={verifyOtp}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 "
          >
            Verify OTP
          </button>
        </div>
      )}

      {newUser && (
      <div className="space-y-2">
        <h3 className="text-sm font-medium">New user — enter your name to finish signup</h3>

        <input
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />

        <button
          onClick={createUser}
          className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
)}

    </div>
  );
}
