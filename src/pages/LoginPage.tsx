import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Login";

export default function LoginPage() {
  const { login } = useContext(AuthContext);

  function handleLoginSuccess(token) {
    login(token);
    alert("¡Login exitoso!");
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
