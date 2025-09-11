import { useState } from "react";
import { api } from "../../config/api";
import "./TicketDetail.css";
import type { Ticket, ProductoConTicketProducto } from "../../types/ticket";

type Props = {
  ticket: Ticket;
  onClose: () => void;
  onUpdated: (ticketActualizado: Ticket) => void;
};

export default function TicketDetail({ ticket, onClose, onUpdated }: Props) {
  const [tipoPago, setTipoPago] = useState<string>(ticket.tipo_pago || "");
  const [productos, setProductos] = useState<ProductoConTicketProducto[]>(
    ticket.productos || []
  );

  function handleRemoveProducto(productoId: number) {
    setProductos((prev) =>
      prev.filter((p) => p.TicketProducto.productoId !== productoId)
    );
  }

  async function handleSave() {
    try {
      const payload = {
        tipo_pago: tipoPago,
        productos: productos.map((p) => ({
          productoId: p.id,
          cantidad: p.TicketProducto.cantidad,
        })),
      };

      // Guardar cambios con Axios
      await api.put(`/tickets/${ticket.id}`, payload);

      // Volver a obtener el ticket actualizado
      const { data: ticketActualizado } = await api.get(`/tickets/${ticket.id}`);

      alert("Ticket actualizado correctamente");

      onUpdated(ticketActualizado);
    } catch (err: any) {
      alert("Error al actualizar ticket: " + err.message);
      console.error(err);
    }
  }

  return (
    <div className="ticket-detail">
      <h2>Detalles del Ticket #{ticket.id}</h2>

      <label>
        Forma de pago:
        <select value={tipoPago} onChange={(e) => setTipoPago(e.target.value)}>
          <option value="">Seleccionar</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="bizum">Bizum</option>
        </select>
      </label>

      <ul>
        {productos.map((producto) => (
          <li key={producto.id}>
            {producto.nombre} — Cantidad: {producto.TicketProducto.cantidad} — Precio:{" "}
            {producto.precio.toFixed(2)} €
            <button onClick={() => handleRemoveProducto(producto.id)}>❌</button>
          </li>
        ))}
      </ul>

      <button onClick={handleSave}>Guardar Cambios</button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
