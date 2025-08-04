import { FaTimes } from "react-icons/fa";
import type { VentaItem } from "../../types/venta";

interface VentaPanelProps {
  venta: VentaItem[];
  eliminarProd: (prodId: number) => void;
}

export default function VentaPanel({ venta, eliminarProd }: VentaPanelProps) {
  return (
    <div className="venta">
      {venta.length === 0 && <div>No hay productos en la venta</div>}
      {venta.map((item) => (
        <div key={item.producto.id} className="producto">
          <div className="info">
            <div className="nombre">{item.producto.nombre}</div>
            <div className="precio">
              {(item.producto.precio * item.cantidad).toFixed(2)}€
            </div>
          </div>

          <div className="cantidad">x{item.cantidad}</div>

          <div className="acciones">
            <button
              onClick={() => eliminarProd(item.producto.id)}
              className="btn-eliminar"
              title="Eliminar producto"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
