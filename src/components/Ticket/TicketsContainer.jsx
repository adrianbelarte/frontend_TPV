// src/components/Ticket/TicketsContainer.jsx
import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import TicketDetalle from "./TicketDetail";

export default function TicketsContainer() {
  const [tickets, setTickets] = useState([]);
  const [ticketSeleccionado, setTicketSeleccionado] = useState(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  async function fetchTickets() {
    try {
      const data = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/tickets`);
      setTickets(data);
    } catch (err) {
      console.error("Error al cargar tickets:", err);
    }
  }

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      <div style={{ width: "40%", borderRight: "1px solid #ccc", paddingRight: "1rem" }}>
        <h2>Lista de Tickets</h2>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tickets.map(ticket => (
            <li
              key={ticket.id}
              onClick={() => setTicketSeleccionado(ticket)}
              style={{
                padding: "0.5rem",
                borderBottom: "1px solid #eee",
                cursor: "pointer",
                backgroundColor: ticketSeleccionado?.id === ticket.id ? "#f0f0f0" : "transparent"
              }}
            >
              <strong>Ticket #{ticket.id}</strong> — {ticket.fecha?.slice(0, 10)} — {ticket.tipo_pago || "Sin pago"}
              <br />
              Total: €{ticket.total.toFixed(2)}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ width: "60%", paddingLeft: "1rem" }}>
        {ticketSeleccionado ? (
          <TicketDetalle ticket={ticketSeleccionado} onUpdated={fetchTickets} />
        ) : (
          <p>Selecciona un ticket para ver el detalle.</p>
        )}
      </div>
    </div>
  );
}
