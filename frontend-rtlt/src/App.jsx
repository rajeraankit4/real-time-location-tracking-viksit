import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import OAuthSuccess from "./components/OAuthSuccess";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import Home from "./components/Home";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
