import { useState, type ChangeEvent } from "react";
import { imprimirTicket } from "../utils/imprimir";

type Ticket = {
  // Define aquí los campos que usas del ticket
  id: number;
  // ...otros campos que necesites
};

type Props = {
  ticket: Ticket;
  onCobrado: () => void;
};

export default function Cobro({ ticket, onCobrado }: Props) {
  const [tipoPago, setTipoPago] = useState<"efectivo" | "tarjeta">("efectivo");

  const manejarCobro = async () => {
    try {
      await imprimirTicket(ticket, tipoPago);
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
