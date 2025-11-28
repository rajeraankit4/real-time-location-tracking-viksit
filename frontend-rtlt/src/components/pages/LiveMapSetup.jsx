import { useNavigate } from "react-router-dom";

export default function LiveMapSetup() {
  const navigate = useNavigate();

  return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-100 via-white to-sky-200 px-6 relative overflow-hidden">

    {/* gradient blobs */}
    <div className="absolute w-72 h-72 bg-blue-200 blur-3xl opacity-40 rounded-full top-[-100px] right-[-100px]" />
    <div className="absolute w-72 h-72 bg-purple-200 blur-3xl opacity-40 rounded-full bottom-[-120px] left-[-120px]" />

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
  </div>
);

}
