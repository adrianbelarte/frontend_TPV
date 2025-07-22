import Login from "../components/Login";

export default function LoginPage() {
  function handleLoginSuccess() {
    // Aquí puedes redirigir o cambiar estado global, etc.
    alert("¡Login exitoso!");
  }

  return <Login onLoginSuccess={handleLoginSuccess} />;
}
