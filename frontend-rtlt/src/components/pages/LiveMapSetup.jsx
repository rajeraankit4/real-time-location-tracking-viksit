import { useNavigate } from "react-router-dom";
import GradientLayout from "../GradientLayout";

export default function LiveMapSetup() {
  const navigate = useNavigate();

  return (
    <GradientLayout>
    <div className="backdrop-blur-xl bg-white/50 border border-white/40 shadow-2xl 
                    rounded-2xl p-10 max-w-md w-full space-y-6 text-center">

      <h1 className="text-3xl font-bold text-gray-800">
        Join or Create a Map
      </h1>

      <button
        onClick={() => navigate("/live-map/join/common")}
        className="w-full py-3 rounded-xl bg-emerald-500 text-white text-lg font-medium
                   shadow-lg hover:bg-emerald-600 hover:shadow-xl active:scale-95 transition-all"
      >
        Join Common Map
      </button>

      <button
        onClick={() => navigate("/live-map/join-group")}
        className="w-full py-3 rounded-xl bg-teal-500 text-white text-lg font-medium
                   shadow-lg hover:bg-teal-600 hover:shadow-xl active:scale-95 transition-all"
      >
        Join a Group
      </button>

      <button
        onClick={() => navigate("/live-map/create-group")}
        className="w-full py-3 rounded-xl bg-indigo-500 text-white text-lg font-medium
                   shadow-lg hover:bg-indigo-600 hover:shadow-xl active:scale-95 transition-all"
      >
        Create a Group
      </button>

    </div>
    </GradientLayout>
  );
}
