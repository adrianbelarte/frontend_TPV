import { useEffect, useState } from "react";

export function useAuth(): boolean {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // Aquí podrías agregar validación del token (e.g., verificar expiración)
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  return isAuthenticated;
}
