import { useContext } from "react";
import type { ReactNode } from "react";

import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface PrivateRouteProps {
  children: ReactNode;
}

export default function PrivateRoute({ children }: PrivateRouteProps) {
  const auth = useContext(AuthContext);

  if (!auth?.isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
