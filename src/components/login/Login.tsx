import { useState } from "react";
import type { FormEvent } from "react";
import { api } from "../../config/api";

import "./Login.css";

type LoginProps = {
  onLoginSuccess: (token: string) => void;
};

export default function Login({ onLoginSuccess }: LoginProps) {
  const [pin, setPin] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  // Añadir dígito al PIN
  function addDigit(digit: string) {
    if (pin.length < 6) { // limitar a 6 dígitos, por ejemplo
      setPin(pin + digit);
      setError(null);
    }
  }

  // Borrar último dígito
  function backspace() {
    setPin(pin.slice(0, -1));
    setError(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (pin.trim() === "") {
      setError("El PIN es obligatorio");
      return;
    }

    try {
      const userId = 1;  // fijo para admin

      const res = await fetch(api("/api/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, pin }), // cambiar a userId
      });

      if (!res.ok) throw new Error("PIN incorrecto");

      const data = await res.json();
      onLoginSuccess(data.token);
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <h2>Login Administrador</h2>
      {error && <p className="error">{error}</p>}

      <div
        className="pin-display"
        aria-label="PIN introducido"
        role="textbox"
        aria-readonly="true"
      >
        {"•".repeat(pin.length).padEnd(6, "○")}
      </div>

      <div className="keypad">
        {["1","2","3","4","5","6","7","8","9"].map((digit) => (
          <button
            key={digit}
            type="button"
            onClick={() => addDigit(digit)}
            className="keypad-button"
          >
            {digit}
          </button>
        ))}
        <button type="button" onClick={backspace} className="keypad-button">
          ←
        </button>
        <button type="button" onClick={() => addDigit("0")} className="keypad-button">
          0
        </button>
        <button type="submit" className="keypad-button submit-button">
          Entrar
        </button>
      </div>
    </form>
  );
}
