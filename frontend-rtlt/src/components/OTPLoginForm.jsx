import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [step, setStep] = useState(1);
  const [newUser, setNewUser] = useState(false);

  const navigate = useNavigate();

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
      const res = await axios.post("http://localhost:5000/api/auth/create-user", { email, name });
      localStorage.setItem("token", res.data.token);
      alert("User created successfully!");
      navigate("/dashboard"); 
    } catch (err) {
      console.error(err);
      alert("Error creating user");
    }
  };

  return (
    <div>
      {step === 1 && (
        <>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
          <button onClick={requestOtp} >Request OTP</button>
        </>
      )}

      {step === 2 && !newUser && (
        <>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
          />
          <button onClick={verifyOtp} >Verify OTP</button>
        </>
      )}

      {newUser && (
        <>
          <h3>Please enter your name to complete sign-in</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
          <button onClick={createUser}>Submit</button>
        </>
      )}
    </div>
  );
}
