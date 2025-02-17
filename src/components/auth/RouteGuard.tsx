import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface RouteGuardProps {
  children: ReactNode;
  requireAuth?: boolean;
}

export function RouteGuard({ children, requireAuth = false }: RouteGuardProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/auth/login" />;
  }

  return <>{children}</>;
}
