import { useState } from "react";
// import OTPLoginForm from "./OTPLoginForm"; // OTP login (disabled for now)
import { FcGoogle } from "react-icons/fc";
import { FiMapPin, FiMessageCircle, FiUsers, FiNavigation } from "react-icons/fi";
import GradientLayout from "../GradientLayout";

const features = [
  { icon: FiUsers, text: "See your group's live locations" },
  { icon: FiMessageCircle, text: "Chat with everyone in real time" },
  { icon: FiMapPin, text: "Drop and share map markers" },
  { icon: FiNavigation, text: "Navigate together" },
];

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
        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-5">
          <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
            <FiMapPin className="text-blue-600 text-2xl" />
          </div>
          <h2 className="text-2xl font-semibold text-center">Welcome</h2>
          <p className="text-gray-500 text-sm text-center mt-1">
            Stay connected with your group, wherever you are.
          </p>
        </div>

        {/* Feature highlights */}
        <ul className="space-y-3 mb-6">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-3 text-sm text-gray-700">
              <span className="w-8 h-8 rounded-md bg-gray-100 flex items-center justify-center">
                <Icon className="text-blue-600" />
              </span>
              {text}
            </li>
          ))}
        </ul>

        {/* <OTPLoginForm onRequestOtp={() => setShowGoogle(false)} /> */}

        {showGoogle && (
          <>
            {/* <div className="flex items-center my-4">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="px-3 text-gray-500 text-sm">or</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div> */}

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

        <p className="text-xs text-gray-400 text-center mt-5">
          Your location is only shared with members of your group.
        </p>
      </div>
    </GradientLayout>
  );
}