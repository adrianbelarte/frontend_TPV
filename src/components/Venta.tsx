import type { FC } from "react";
import type { ItemVenta, MetodoPago } from "../types/venta";

interface VentaProps {
  venta: ItemVenta[];
  onPagar: (metodo: MetodoPago) => void;
  onEliminarProducto: (productoId: number) => void;
}

const Venta: FC<VentaProps> = ({ venta, onPagar, onEliminarProducto }) => {
  const total = venta.reduce(
    (sum, item) => sum + item.cantidad * item.producto.precio,
    0
  );

  return (
    <div>
      <h2>Venta actual</h2>
      <ul>
        {venta.map((item) => (
          <li
            key={item.producto.id}
            onClick={() => onEliminarProducto(item.producto.id)}
            style={{ cursor: "pointer" }}
          >
            {item.producto.nombre} x {item.cantidad} ={" "}
            {(item.producto.precio * item.cantidad).toFixed(2)} €
          </li>
        ))}
      </ul>
      <p>
        <strong>Total:</strong> {total.toFixed(2)} €
      </p>

      <button onClick={() => onPagar("efectivo")}>Cobrar en efectivo</button>
      <button onClick={() => onPagar("tarjeta")}>Cobrar con tarjeta</button>
    </div>
  );
};

export default Venta;
