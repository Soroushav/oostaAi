import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const RequireAuth = ({ children }: any) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null; // or spinner

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export const RedirectIfAuth = ({ children }: any) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  if (isAuthenticated) {
    return <Navigate to="/main" replace />;
  }

  return children;
};