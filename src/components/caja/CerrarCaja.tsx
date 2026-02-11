import { useEffect, useState } from "react";
import { api } from "../../config/api";
import { CierreCajaGenerado } from "./CierreCajaGenerado";

const modoSimulacion = import.meta.env.VITE_MODO_SIMULACION === "true";

type ResumenCaja = {
  total_efectivo: number;
  total_tarjeta: number;
  total_general: number;
};

type Cierre = {
  id: number;
  fecha: string;
  total_efectivo: number;
  total_tarjeta: number;
  total_general: number;
  reprinted_count?: number;
};

type RespuestaCerrarCaja = {
  error?: string;
  resumen?: ResumenCaja;
  mensaje?: string;
  archivo?: string;
  productos?: { nombre: string; cantidad: number }[];
};

type RespuestaListaCierres = {
  items: Cierre[];
};

export default function CerrarCaja() {
  const [resumen, setResumen] = useState<ResumenCaja | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [productos, setProductos] = useState<{ nombre: string; cantidad: number }[]>([]);
  const [fecha, setFecha] = useState("");

  // Histórico
  const [cierres, setCierres] = useState<Cierre[]>([]);
  const [loadingCierres, setLoadingCierres] = useState(false);
  const [errorCierres, setErrorCierres] = useState("");
  const [reimprimiendoId, setReimprimiendoId] = useState<number | null>(null);

  const cargarCierres = async () => {
    setLoadingCierres(true);
    setErrorCierres("");
    try {
      const { data } = await api.get<RespuestaListaCierres>("/cierres");
      setCierres(data.items || []);
    } catch (err: any) {
      setErrorCierres(err.message || "Error cargando cierres");
    } finally {
      setLoadingCierres(false);
    }
  };

  useEffect(() => {
    cargarCierres();
  }, []);

  const reimprimirCierre = async (id: number) => {
    const ok = confirm("¿Reimprimir este cierre de caja?");
    if (!ok) return;

    setReimprimiendoId(id);
    setErrorCierres("");

    try {
      await api.post(`/cierres/${id}/reimprimir`);
      alert("Cierre enviado a impresión");
      await cargarCierres(); // refresca reprinted_count
    } catch (err: any) {
      alert(err.message || "Error al reimprimir");
    } finally {
      setReimprimiendoId(null);
    }
  };

  const cerrarCaja = async () => {
    setLoading(true);
    setError("");
    setMensaje("");
    setResumen(null);
    setProductos([]);
    setFecha("");

    try {
      const { data: res } = await api.post<RespuestaCerrarCaja>("/cerrar-caja");

      if (res.error) throw new Error(res.error);

      if (res.resumen) setResumen(res.resumen);
      if (res.mensaje) setMensaje(res.mensaje);
      if (res.productos) setProductos(res.productos);

      const fechaActual = new Date().toLocaleString();
      setFecha(fechaActual);

      // Mantengo tu impresión "en el momento" (si no estás en simulación)
      if (!modoSimulacion && res.resumen) {
        await api.post("/imprimir-cierre", {
          fecha: fechaActual,
          resumen: res.resumen,
          productos: res.productos || [],
        });
      }

      // Descargar excel si viene
      if (res.archivo) {
        const urlDescarga = `${import.meta.env.VITE_BASE_URL}${res.archivo}`;
        window.open(urlDescarga, "_blank");
      }

      // ✅ refrescar histórico tras cerrar caja
      await cargarCierres();
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
          <CierreCajaGenerado
            fecha={fecha}
            resumen={resumen}
            productos={productos}
            modoSimulacion={modoSimulacion}
          />
        </div>
      )}

      <hr style={{ margin: "2rem 0" }} />

      <h3>Histórico de cierres</h3>

      <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: "0.75rem" }}>
        <button
          onClick={cargarCierres}
          disabled={loadingCierres}
          style={{
            backgroundColor: "#eee",
            padding: "0.5rem 1rem",
            border: "1px solid #ccc",
            borderRadius: 5,
            cursor: loadingCierres ? "not-allowed" : "pointer",
          }}
        >
          {loadingCierres ? "Cargando…" : "Actualizar"}
        </button>

        {errorCierres && <span style={{ color: "red" }}>{errorCierres}</span>}
      </div>

      {loadingCierres ? (
        <p style={{ marginTop: "1rem" }}>Cargando cierres…</p>
      ) : cierres.length === 0 ? (
        <p style={{ marginTop: "1rem" }}>No hay cierres guardados todavía.</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", borderBottom: "1px solid #ddd", padding: 8 }}>Fecha</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Efectivo</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Tarjeta</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Total</th>
              <th style={{ textAlign: "right", borderBottom: "1px solid #ddd", padding: 8 }}>Reimp.</th>
              <th style={{ borderBottom: "1px solid #ddd", padding: 8 }}></th>
            </tr>
          </thead>
          <tbody>
            {cierres.map((c) => (
              <tr key={c.id}>
                <td style={{ padding: 8 }}>{c.fecha}</td>
                <td style={{ padding: 8, textAlign: "right" }}>{Number(c.total_efectivo).toFixed(2)} €</td>
                <td style={{ padding: 8, textAlign: "right" }}>{Number(c.total_tarjeta).toFixed(2)} €</td>
                <td style={{ padding: 8, textAlign: "right", fontWeight: 700 }}>
                  {Number(c.total_general).toFixed(2)} €
                </td>
                <td style={{ padding: 8, textAlign: "right" }}>{c.reprinted_count || 0}</td>
                <td style={{ padding: 8, textAlign: "right" }}>
                  <button
                    onClick={() => reimprimirCierre(c.id)}
                    disabled={reimprimiendoId === c.id}
                    style={{
                      backgroundColor: "#222",
                      color: "white",
                      padding: "0.4rem 0.8rem",
                      border: "none",
                      borderRadius: 5,
                      cursor: reimprimiendoId === c.id ? "not-allowed" : "pointer",
                    }}
                  >
                    {reimprimiendoId === c.id ? "Imprimiendo…" : "Reimprimir"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
