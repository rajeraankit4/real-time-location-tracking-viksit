import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/pages/Login-page";
import OAuthSuccess from "./utils/OAuthSuccess";
import Dashboard from "./components/pages/Dashboard";
import ProtectedLayout from "./utils/ProtectedLayout";
import Home from "./components/pages/Home";
import LiveMapRoutes from "./routes/LiveMapRoutes";
import { Toaster } from "react-hot-toast";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Reset default icon paths
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function App() {
  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { zIndex: 9999 }, // ensure it appears above map
        }}
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-map/*" element={<LiveMapRoutes />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
