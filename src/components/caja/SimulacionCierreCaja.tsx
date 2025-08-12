
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
};

export default function SimulacionCierreCaja({ fecha, productos, resumen }: Props) {
  return (
    <div style={{
      width: "300px",
      border: "1px solid #333",
      padding: "1rem",
      fontFamily: "monospace",
      backgroundColor: "#fff"
    }}>
      <div style={{ textAlign: "center", marginBottom: "1rem" }}>
        <img src="/src/assets/1000132003.jpg" alt="Logo" style={{ width: "40px", height:"40px" }} />
        <div><strong>GRUPO MANHATTAN</strong></div>
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
        <div><strong>Total general: €{resumen.total_general.toFixed(2)}</strong></div>
      </div>

      <hr />

      <div style={{ textAlign: "center", marginTop: "1rem" }}>
        Gracias por confiar en Grupo Manhattan<br />Valencia
      </div>
    </div>
  );
}
