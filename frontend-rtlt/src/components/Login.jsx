import { useState } from "react";
import OTPLoginForm from "./OTPLoginForm";

export default function Login() {
  const [showGoogle, setShowGoogle] = useState(true);

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-sky-50 p-6">
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Welcome back</h2>

        <OTPLoginForm onRequestOtp={() => setShowGoogle(false)} />

        {showGoogle && (
          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md bg-red-500 hover:bg-red-600 text-white font-medium transition"
            >
              Login with Google
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
