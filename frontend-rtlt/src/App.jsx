import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import OAuthSuccess from "./components/OAuthSuccess";
import Dashboard from "./components/Dashboard";
import ProtectedLayout from "./utils/ProtectedLayout";
import Home from "./components/Home";
import LiveMapRoutes from "./routes/LiveMapRoutes";
function App() {
  return (
    <Router>
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
