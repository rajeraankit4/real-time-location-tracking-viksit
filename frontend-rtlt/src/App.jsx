import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import OAuthSuccess from "./components/OAuthSuccess";
import Dashboard from "./components/Dashboard";
import ProtectedLayout from "../src/components/ProtectedLayout";
import Home from "./components/Home";
import LiveMapSetup from "./components/LiveMapSetup";
function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Protected routes */}
        <Route element={<ProtectedLayout />}>
          <Route path="/oauth-success" element={<OAuthSuccess />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/live-map-setup" element={<LiveMapSetup />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
