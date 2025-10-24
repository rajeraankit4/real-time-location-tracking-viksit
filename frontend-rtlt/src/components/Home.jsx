import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, []);
  return (
    <div>
      <h1>Welcome to Our App</h1>
      <Link to="/login">
        <button>
          Login
        </button>
      </Link>
    </div>
  );
}

