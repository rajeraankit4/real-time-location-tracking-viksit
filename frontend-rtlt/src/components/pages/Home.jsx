import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 px-6 relative overflow-hidden">
      
      {/* Small gradient blobs for style */}
      <div className="absolute w-72 h-72 bg-blue-200 blur-3xl opacity-40 rounded-full top-[-100px] right-[-100px]" />
      <div className="absolute w-72 h-72 bg-purple-200 blur-3xl opacity-40 rounded-full bottom-[-120px] left-[-120px]" />

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

      <footer className="absolute bottom-4 text-gray-400 text-xs">
        Powered by WebSockets · Leaflet Maps · GPS API
      </footer>
    </div>
  );
}
