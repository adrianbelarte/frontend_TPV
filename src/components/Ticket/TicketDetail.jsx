import { useState } from "react";
import { authFetch } from "../../utils/authFetch";
import "./TicketDetail.css";

export default function TicketDetail({ ticket, onClose, onUpdated }) {
  const [tipoPago, setTipoPago] = useState(ticket.tipo_pago || "");
  const [productos, setProductos] = useState(ticket.productos || []);

  function handleRemoveProducto(productoId) {
    setProductos(prev => prev.filter(p => p.TicketProducto.productoId !== productoId));
  }

  async function handleSave() {
    try {
      const payload = {
        tipo_pago: tipoPago,
        productos: productos.map(p => ({
          productoId: p.id,
          cantidad: p.TicketProducto.cantidad,
        }))
      };

      await authFetch(`${import.meta.env.VITE_BASE_URL}/api/tickets/${ticket.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      alert("Ticket actualizado correctamente");
      onUpdated();
      onClose();
    } catch (err) {
      alert("Error al actualizar ticket");
      console.error(err);
    }
  }

  return (
    <div className="ticket-detail">
      <h2>Detalles del Ticket #{ticket.id}</h2>

      <label>
        Forma de pago:
        <select value={tipoPago} onChange={e => setTipoPago(e.target.value)}>
          <option value="">Seleccionar</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="bizum">Bizum</option>
        </select>
      </label>

      <ul>
        {productos.map(producto => (
          <li key={producto.id}>
            {producto.nombre} — Cantidad: {producto.TicketProducto.cantidad} — Precio: {producto.precio.toFixed(2)} €
            <button onClick={() => handleRemoveProducto(producto.id)}>❌</button>
          </li>
        ))}
      </ul>

      <button onClick={handleSave}>Guardar Cambios</button>
      <button onClick={onClose}>Cerrar</button>
    </div>
  );
}
