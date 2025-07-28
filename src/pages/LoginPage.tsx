import { useContext } from "react";
import type { FC } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/login/Login";

const LoginPage: FC = () => {
  // Como AuthContext puede ser null, mejor hacer chequeo
  const auth = useContext(AuthContext);
  if (!auth) return null; // o mostrar un loading/error

  const { login } = auth;

  function handleLoginSuccess(token: string) {
    login(token);
    alert("¡Login exitoso!");
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
};

export default LoginPage;
