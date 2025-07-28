// src/context/AuthContext.tsx
import { createContext, useState, useContext } from "react";
import type { ReactNode } from "react";


export interface AuthContextType {
  token: string | null;
  login: (newToken: string) => void;
  logout: () => void;
  isLoggedIn: boolean;
}

// Valor por defecto para evitar null
const defaultAuthContext: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
  isLoggedIn: false,
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(
    () => localStorage.getItem("token") || null
  );

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem("token", newToken);
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem("token");
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider value={{ token, login, logout, isLoggedIn }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook para usar el contexto con seguridad y sin necesidad de checkear null
export function useAuth() {
  return useContext(AuthContext);
}
