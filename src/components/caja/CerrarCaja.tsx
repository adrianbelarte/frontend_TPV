import { useState } from "react";
import { authFetch } from "../../utils/authFetch";
import { api } from "../../config/api";
import { CierreCajaGenerado } from "./CierreCajaGenerado";

const modoSimulacion = import.meta.env.VITE_MODO_SIMULACION === "true";

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
  productos?: { nombre: string; cantidad: number }[];
};

export default function CerrarCaja() {
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [productos, setProductos] = useState<{ nombre: string; cantidad: number }[]>([]);
  const [fecha, setFecha] = useState("");

  const cerrarCaja = async () => {
    setLoading(true);
    setError("");
    setMensaje("");
    setResumen(null);
    setProductos([]);
    setFecha("");

    try {
      const res = (await authFetch(api("/api/cerrar-caja"), {
        method: "POST",
      })) as RespuestaCerrarCaja;

      if (res.error) throw new Error(res.error);

      if (res.resumen) setResumen(res.resumen);
      if (res.mensaje) setMensaje(res.mensaje);
      if (res.productos) setProductos(res.productos);

      const fechaActual = new Date().toLocaleString();
      setFecha(fechaActual);

      if (!modoSimulacion && res.resumen) {
        await authFetch(api("/api/imprimir-cierre"), {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fecha: fechaActual,
            resumen: res.resumen,
            productos: res.productos || [],
          }),
        });
      }

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
          <CierreCajaGenerado fecha={fecha} resumen={resumen} productos={productos} modoSimulacion={modoSimulacion} />
        </div>
      )}
    </div>
  );
}
