import { useState } from "react";
import { api } from "../config/api"; // si tienes este helper

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (username !== "Admin") {
      setError("Solo el usuario Admin puede iniciar sesión");
      return;
    }

    try {
      const res = await fetch(api("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Usuario o contraseña incorrectos");

      const data = await res.json();
      onLoginSuccess(data.token);
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login Administrador</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
        <label>Usuario</label>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoFocus
        />
      </div>
      <div>
        <label>Contraseña</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Entrar</button>
    </form>
  );
}
