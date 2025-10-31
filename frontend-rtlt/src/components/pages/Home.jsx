import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div>
      <h1>Welcome to Our App</h1>
      <button 
        className="btn btn-primary"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
    </div>
  );
} 