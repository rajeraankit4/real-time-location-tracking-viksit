import { useState } from "react";
import axios from "axios";
import InputField from "./InputField";
import Button from "./Button";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState(1);

  const requestOtp = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/request-otp", { email });
      setStep(2);
      alert("OTP sent! Check console.");
    } catch (err) {
      console.error(err);
      alert("Error requesting OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { email, otp });
      console.log("JWT Token:", res.data.token);
      alert("Login successful!");
      // store JWT in localStorage or state
    } catch (err) {
      console.error(err);
      alert("Invalid OTP");
    }
  };

  return (
    <div>
      <h1>Email OTP Login</h1>
      {step === 1 && (
        <>
          <InputField type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} />
          <Button onClick={requestOtp}>Request OTP</Button>
        </>
      )}
      {step === 2 && (
        <>
          <InputField placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
          <Button onClick={verifyOtp}>Verify OTP</Button>
        </>
      )}
    </div>
  );
}
