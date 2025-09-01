import { useState, type ChangeEvent } from "react";
import { imprimirTicket } from "../utils/imprimirTicket";
import type { TicketData } from "../components/Ticket/TicketGenerado";

const MODO_SIMULACION = import.meta.env.VITE_MODO_SIMULACION === "true";

type Props = {
  ticket: TicketData;
  onCobrado: () => void;
};

export default function Cobro({ ticket, onCobrado }: Props) {
  const [tipoPago, setTipoPago] = useState<"efectivo" | "tarjeta">("efectivo");

  const manejarCobro = async () => {
  try {
    if (!MODO_SIMULACION) {
      await imprimirTicket(ticket, tipoPago); // imprimir solo si no es simulación
    } else {
      alert("Ticket simulado en pantalla"); // opcional
    }
    onCobrado();
  } catch (err: any) {
    alert("Error al cobrar: " + err.message);
  }
};

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setTipoPago(e.target.value as "efectivo" | "tarjeta");
  };

  return (
    <div>
      <h3>Forma de pago</h3>
      <select value={tipoPago} onChange={handleChange}>
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
      </select>
      <button onClick={manejarCobro}>Cobrar</button>
    </div>
  );
}
