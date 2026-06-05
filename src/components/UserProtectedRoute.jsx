import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function UserProtectedRoute({ children }) {
  const { isUserLoggedIn, isAuthReady } = useAuth();
  if (!isAuthReady) return null;
  return isUserLoggedIn ? children : <Navigate to="/user/login" />;
}
