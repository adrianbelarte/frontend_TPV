import { useContext } from "react";
import type { FC } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/login/Login";

const LoginPage: FC = () => {
  const auth = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();

  if (!auth) return null;

  const { login } = auth;

  const from = (location.state as any)?.from?.pathname || "/";

  function handleLoginSuccess(token: string) {
    login(token);
    navigate(from, { replace: true }); // redirige sin dejar /login en el historial
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

export default LoginPage;
