import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm({ onRequestOtp }) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [newUser, setNewUser] = useState(false);

  const navigate = useNavigate();

  const requestOtp = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      await axios.post(`${baseUrl.replace(/\/$/, "")}/api/auth/request-otp`, { email });
      // notify parent so it can hide other login options
      if (typeof onRequestOtp === "function") onRequestOtp();
      setStep(2);
      alert("OTP sent! Check your email.");
    } catch (err) {
      console.error(err);
      alert("Error requesting OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${baseUrl.replace(/\/$/, "")}/api/auth/verify-otp`, { email, otp });

      if (res.data.newUser) {
        setNewUser(true);
      } else {
        localStorage.setItem("token", res.data.token);
        alert("Login successful!");
        navigate("/dashboard");
      }
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  const createUser = async () => {
    try {
      const baseUrl = import.meta.env.VITE_BACKEND_URL;
      const res = await axios.post(`${baseUrl.replace(/\/$/, "")}/api/auth/create-user`, { email, name });
      localStorage.setItem("token", res.data.token);
      alert("User created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating user");
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
          <h3 className="text-sm font-medium">Please enter your name to complete sign-in</h3>
          <input
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <button
            onClick={createUser}
            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 "
          >
            Submit
          </button>
        </div>
      )}
    </div>
  );
}
