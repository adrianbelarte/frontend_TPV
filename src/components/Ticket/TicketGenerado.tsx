import React from "react";
import "./TicketGenerado.css";
import { imprimirTicket } from "../../utils/imprimirTicket";

export interface TicketProduct {
  nombre: string;
  cantidad: number;
}

export interface TicketData {
  fecha: string;
  productos: TicketProduct[];
  total: string;
  tipo_pago?: "efectivo" | "tarjeta";  // opcional
}

interface TicketGeneradoProps {
  ticket: TicketData;
  modoSimulacion: boolean;
  tipoPago: "efectivo" | "tarjeta";  // nuevo parámetro obligatorio
}

export const TicketGenerado: React.FC<TicketGeneradoProps> = ({ ticket, modoSimulacion, tipoPago }) => {
  React.useEffect(() => {
    imprimirTicket(ticket, tipoPago); // Llamar automáticamente al mostrar el ticket
  }, [ticket, tipoPago]);

  if (!modoSimulacion) {
    return null;  // no mostrar nada si no es simulación
  }

  return (
    <div className="ticket-simulation">
      <div className="ticket-header">
        <img
          src="/src/assets/1000132003.jpg"
          alt="Logo"
          className="ticket-logo"
        />
        <div className="ticket-company">GRUPO MANHATTAN</div>
        <div className="ticket-location">VALENCIA</div>
        <div className="ticket-date">{ticket.fecha}</div>
      </div>

      <hr className="ticket-separator" />

      <div className="ticket-items">
        {ticket.productos.map((p, i) => (
          <div key={i} className="ticket-item">
            {p.cantidad} x {p.nombre}
          </div>
        ))}
      </div>

      <hr className="ticket-separator" />

      <div className="ticket-total">Total: {ticket.total} €</div>

      <div className="ticket-footer">
        Gracias por confiar en
        <br />
        Grupo Manhattan
        <br />
        Valencia
      </div>
    </div>
  );
};
