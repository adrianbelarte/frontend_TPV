import { useState } from "react";
import { authFetch } from "../../utils/authFetch";
import { api } from "../../config/api";

type ResumenCaja = {
  total_efectivo: number;
  total_tarjeta: number;
  total_general: number;
};

type RespuestaCerrarCaja = {
  error?: string;
  resumen?: ResumenCaja;
  mensaje?: string;
  archivo?: string;
};

export default function CerrarCaja() {
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  const cerrarCaja = async () => {
    setLoading(true);
    setError("");
    setMensaje("");
    setResumen(null);

    try {
      const res = (await authFetch(api("/api/cerrar-caja"), {
        method: "POST",
      })) as RespuestaCerrarCaja;

      if (res.error) throw new Error(res.error);

      if (res.resumen) setResumen(res.resumen);
      if (res.mensaje) setMensaje(res.mensaje);

      if (res.archivo) {
        const urlDescarga = `${import.meta.env.VITE_BASE_URL}${res.archivo}`;
        window.open(urlDescarga, "_blank");
      }
    } catch (err: any) {
      setError(err.message || "Error al cerrar caja");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Cierre de Caja</h2>
      <button
        onClick={cerrarCaja}
        disabled={loading}
        style={{
          backgroundColor: "#222",
          color: "white",
          padding: "0.7rem 1.5rem",
          border: "none",
          borderRadius: "5px",
          cursor: loading ? "not-allowed" : "pointer",
          marginTop: "1rem",
        }}
      >
        {loading ? "Cerrando caja..." : "Cerrar Caja"}
      </button>

      {mensaje && <p style={{ color: "green", marginTop: "1rem" }}>{mensaje}</p>}
      {error && <p style={{ color: "red", marginTop: "1rem" }}>{error}</p>}

      {resumen && (
        <div style={{ marginTop: "2rem" }}>
          <h4>Resumen:</h4>
          <ul>
            <li>Total Efectivo: €{resumen.total_efectivo.toFixed(2)}</li>
            <li>Total Tarjeta: €{resumen.total_tarjeta.toFixed(2)}</li>
            <li>Total General: €{resumen.total_general.toFixed(2)}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
