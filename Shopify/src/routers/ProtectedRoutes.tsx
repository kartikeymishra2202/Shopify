import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth/authContext";
import type { JSX } from "react";


interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: string[];
  fallbackPath?: string;
}

const ProtectedRoute = ({ children, allowedRoles, fallbackPath }: ProtectedRouteProps) => {
  const { state } = useAuth();

  if (!state.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && state.user && !allowedRoles.includes(state.user.role)) {
    const redirectTo = fallbackPath ?? (state.user.role === "admin" ? "/user" : "/");
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default ProtectedRoute;
