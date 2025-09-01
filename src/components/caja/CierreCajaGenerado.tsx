import React from "react";

type ResumenCaja = {
  total_efectivo: number;
  total_tarjeta: number;
  total_general: number;
};

type ProductoVenta = {
  nombre: string;
  cantidad: number;
};

type Props = {
  fecha: string;
  productos: ProductoVenta[];
  resumen: ResumenCaja;
  modoSimulacion: boolean;
};

export const CierreCajaGenerado: React.FC<Props> = ({ fecha, productos, resumen, modoSimulacion }) => {
 React.useEffect(() => {
  if (!modoSimulacion) {
    // Solo imprimir si NO es simulación
    fetch(`${import.meta.env.VITE_APP_API_URL}/api/imprimir-cierre`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fecha, resumen, productos }),
    }).then((res) => {
      if (!res.ok) throw new Error("Error al imprimir cierre de caja");
      console.log("Cierre de caja enviado a impresora");
    }).catch(console.error);
  }
}, [fecha, resumen, productos, modoSimulacion]);

if (!modoSimulacion) return null; // no mostrar nada si es impresión real

  return (
    <div
      style={{
        width: "300px",
        border: "1px solid #333",
        padding: "1rem",
        fontFamily: "monospace",
        backgroundColor: "#fff",
      }}
    >
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img src="/src/assets/1000132003.jpg" alt="Logo" style={{ width: "40px", height: "40px" }} />
        <div>
          <strong>GRUPO MANHATTAN</strong>
        </div>
        <div>VALENCIA</div>
        <div>{fecha}</div>
      </div>

      <hr />

      <div>
        <strong>Productos vendidos:</strong>
        {productos.length === 0 && <div>(No hay productos)</div>}
        {productos.map((p, i) => (
          <div key={i}>
            x{p.cantidad} {p.nombre}
          </div>
        ))}
      </div>

      <hr />

      <div>
        <div>Total efectivo: €{resumen.total_efectivo.toFixed(2)}</div>
        <div>Total tarjeta: €{resumen.total_tarjeta.toFixed(2)}</div>
        <div>
          <strong>Total general: €{resumen.total_general.toFixed(2)}</strong>
        </div>
      </div>

      <hr />

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        Gracias por confiar en Grupo Manhattan
        <br />
        Valencia
      </div>
    </div>
  );
};
