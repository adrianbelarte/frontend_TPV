import { useState } from "react";
import { api } from "../../config/api";
import type { Ticket, ProductoConTicketProducto } from "../../types/ticket";

type Props = {
  ticket: Ticket;
  onClose: () => void;
  onUpdated: (ticketActualizado: Ticket) => void;
};

export default function TicketDetail({ ticket, onClose, onUpdated }: Props) {
  const [tipoPago, setTipoPago] = useState<string>(ticket.tipo_pago || "");
  const [productos, setProductos] = useState<ProductoConTicketProducto[]>(
    (ticket.productos as any) || []
  );
  const [saving, setSaving] = useState(false);

  function handleRemoveProducto(productoId: number) {
    setProductos((prev) =>
      prev.filter((p) => p.TicketProducto.productoId !== productoId)
    );
  }

  async function handleSave() {
    try {
      setSaving(true);
      const payload = {
        tipo_pago: tipoPago || null,
        productos: productos.map((p) => ({
          productoId: p.id,
          cantidad: p.TicketProducto.cantidad,
        })),
      };

      await api.put(`/tickets/${ticket.id}`, payload);
      const { data: ticketActualizado } = await api.get<Ticket>(`/tickets/${ticket.id}`);

      onUpdated(ticketActualizado);
    } catch (err: any) {
      alert("Error al actualizar ticket: " + (err?.message || "desconocido"));
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="h-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-800">
          Detalles del Ticket #{ticket.id}
        </h2>
        <button
          onClick={onClose}
          className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold hover:bg-neutral-50"
        >
          Cerrar
        </button>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-neutral-700">
          Forma de pago
        </label>
        <select
          value={tipoPago}
          onChange={(e) => setTipoPago(e.target.value)}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        >
          <option value="">Seleccionar</option>
          <option value="efectivo">Efectivo</option>
          <option value="tarjeta">Tarjeta</option>
          <option value="bizum">Bizum</option>
        </select>
      </div>

      <div className="rounded-xl border border-neutral-100">
        <ul className="divide-y divide-neutral-100">
          {productos.map((producto) => (
            <li key={producto.id} className="flex items-center justify-between gap-4 p-3">
              <div className="min-w-0">
                <p className="truncate font-medium text-neutral-800">{producto.nombre}</p>
                <p className="text-sm text-neutral-500">
                  Cantidad: {producto.TicketProducto.cantidad} · Precio:{" "}
                  {Number(producto.precio).toFixed(2)} €
                </p>
              </div>
              <button
                onClick={() => handleRemoveProducto(producto.id)}
                className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700"
                aria-label="Quitar producto"
              >
                Quitar
              </button>
            </li>
          ))}
          {productos.length === 0 && (
            <li className="p-3 text-sm text-neutral-500">No hay productos.</li>
          )}
        </ul>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700 disabled:opacity-60"
        >
          {saving ? "Guardando…" : "Guardar Cambios"}
        </button>
        <button
          onClick={onClose}
          className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-300"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
