import { useState } from "react";
import OTPLoginForm from "./OTPLoginForm";
import { FcGoogle } from "react-icons/fc";
import GradientLayout from "../GradientLayout";


export default function Login() {
  const [showGoogle, setShowGoogle] = useState(true);

  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_BACKEND_URL;
    window.location.href = `${backendUrl}/api/auth/google`;
  };

  return (
  <GradientLayout>
      <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-6">
        <h2 className="text-2xl font-semibold text-center mb-4">Welcome</h2>

        <OTPLoginForm onRequestOtp={() => setShowGoogle(false)} />

        {showGoogle && (
          <>
        <div className="flex items-center my-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>


          <div className="mt-4">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-3 w-full border border-gray-300 bg-white py-2 rounded-md hover:bg-gray-50 transition"
            >
              <FcGoogle className="text-xl" />
              <span className="text-gray-700 font-medium">Sign in with Google</span>
            </button>
          </div>
          </>
        )}
      </div>
    </GradientLayout>
  );
}
