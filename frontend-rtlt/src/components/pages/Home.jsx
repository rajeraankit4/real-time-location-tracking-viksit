import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import GradientLayout from "../GradientLayout";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <GradientLayout>
      <div className="backdrop-blur-xl bg-white/50 border border-white/40 shadow-2xl rounded-2xl p-10 max-w-lg text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-3">
          Real-Time Location Tracking
        </h1>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Track, share, and monitor live locations instantly.
          Ideal for events, teams, logistics, and personal use.
        </p>

        <button
          onClick={() => navigate("/login")}
          className="px-8 py-3 rounded-full bg-blue-600 text-white font-medium text-lg shadow-lg hover:shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
        >
          Start Tracking
        </button>
      </div>
    </GradientLayout>
  );
}
