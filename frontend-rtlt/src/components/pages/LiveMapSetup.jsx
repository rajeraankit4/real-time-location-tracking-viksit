import { useNavigate } from "react-router-dom";

export default function LiveMapSetup() {
  const navigate = useNavigate();

  return (
    <div className="p-6 max-w-md mx-auto space-y-4">
      <h1 className="text-xl font-bold text-slate-800">Join or Create a Map</h1>

      <button
        onClick={() => navigate("/live-map/join/common")}
        className="w-full py-3 bg-emerald-500 text-white rounded-lg shadow hover:bg-emerald-600"
      >
        Join Common Map
      </button>

      <button
        onClick={() => navigate("/live-map/join-group")}
        className="w-full py-3 bg-teal-500 text-white rounded-lg shadow hover:bg-teal-600"
      >
        Join a Group
      </button>

      <button
        onClick={() => navigate("/live-map/create-group")}
        className="w-full py-3 bg-indigo-500 text-white rounded-lg shadow hover:bg-indigo-600"
      >
        Create a Group
      </button>
    </div>
  );
}
