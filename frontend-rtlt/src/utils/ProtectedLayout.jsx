// ProtectedLayout.jsx
import { Outlet } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute"; // your existing ProtectedRoute 
export default function ProtectedLayout() {
  return (
    <ProtectedRoute>
      <Outlet /> {/* Nested routes will render here */}
    </ProtectedRoute>
  );
}
