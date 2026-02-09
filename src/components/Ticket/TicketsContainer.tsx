import { useEffect, useState } from "react";
import TicketDetail from "./TicketDetail";
import { api } from "../../config/api";
import type { Ticket } from "../../types/ticket";

export default function TicketsContainer() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      setLoading(true);
      const { data } = await api.get<Ticket[]>("/tickets");
      setTickets(data);
      // si no hay seleccionado o fue borrado, limpia selección
      if (ticketSeleccionado) {
        const sigue = data.find((t) => t.id === ticketSeleccionado.id);
        if (!sigue) setTicketSeleccionado(null);
      }
    } catch (err: any) {
      console.error("Error al cargar tickets:", err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto grid max-w-screen-2xl grid-cols-1 gap-6 p-4 lg:grid-cols-12">
      {/* Lista */}
      <aside className="lg:col-span-5 xl:col-span-4">
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
          <header className="border-b border-neutral-100 px-5 py-4">
            <h2 className="text-lg font-semibold text-neutral-800">Tickets</h2>
            <p className="text-xs text-neutral-500">
              {loading ? "Cargando…" : `${tickets.length} resultado(s)`}
            </p>
          </header>

          <div className="max-h-[70vh] overflow-y-auto px-3 py-3">
            <ul className="space-y-2">
              {tickets.map((ticket) => {
                const isSel = ticketSeleccionado?.id === ticket.id;
                const fechaStr = ticket.fecha
                  ? new Date(ticket.fecha).toISOString().slice(0, 10)
                  : "-";
                const totalNum = Number(ticket.total || 0);

                return (
                  <li key={ticket.id}>
                    <button
                      onClick={() => setTicketSeleccionado(ticket)}
                      className={`w-full rounded-xl border px-3 py-2 text-left transition ${
                        isSel
                          ? "border-sky-300 bg-sky-50"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <strong className="text-neutral-800">Ticket #{ticket.id}</strong>
                        <span className="text-xs text-neutral-500">
                          {ticket.tipo_pago || "Sin pago"}
                        </span>
                      </div>
                      <div className="mt-0.5 text-sm text-neutral-600">
                        {fechaStr} — Total: €{totalNum.toFixed(2)}
                      </div>
                    </button>
                  </li>
                );
              })}
              {!tickets.length && !loading && (
                <li className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-500">
                  No hay tickets.
                </li>
              )}
            </ul>
          </div>
        </div>
      </aside>

      {/* Detalle */}
      <section className="lg:col-span-7 xl:col-span-8">
        {ticketSeleccionado ? (
          <TicketDetail
            ticket={ticketSeleccionado}
            onUpdated={(ticketActualizado) => {
              setTickets((prev) =>
                prev.map((t) => (t.id === ticketActualizado.id ? ticketActualizado : t))
              );
              setTicketSeleccionado(ticketActualizado);
            }}
            onClose={() => setTicketSeleccionado(null)}
          />
        ) : (
          <div className="flex h-[70vh] items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-white text-sm text-neutral-500">
            Selecciona un ticket para ver el detalle.
          </div>
        )}
      </section>
    </div>
  );
}
