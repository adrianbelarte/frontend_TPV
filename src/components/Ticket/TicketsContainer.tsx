import { useEffect, useState } from "react";
import TicketDetail from "./TicketDetail";
import { api } from "../../config/api";
import "./TicketsContainer.css";
import type { Ticket } from "../../types/ticket";  

export default function TicketsContainer() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState<Ticket | null>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const { data } = await api.get<Ticket[]>("/tickets");
      setTickets(data);
    } catch (err: any) {
      console.error("Error al cargar tickets:", err.message);
    }
  }

  return (
    <div className="tickets-container">
      <div className="tickets-list">
        <ul>
          {tickets.map((ticket) => (
            <li
              key={ticket.id}
              onClick={() => setTicketSeleccionado(ticket)}
              className={ticketSeleccionado?.id === ticket.id ? "selected" : ""}
            >
              <strong>Ticket #{ticket.id}</strong> — {ticket.fecha?.slice(0, 10)} — {ticket.tipo_pago || "Sin pago"}
              <br />
              Total: €{ticket.total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>
      <div className="tickets-detail-container">
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
          <p>Selecciona un ticket para ver el detalle.</p>
        )}
      </div>
    </div>
  );
}
