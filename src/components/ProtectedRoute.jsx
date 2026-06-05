import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAdmin, isAuthReady } = useAuth();

  if (!isAuthReady) return null;
  return isAdmin ? children : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
