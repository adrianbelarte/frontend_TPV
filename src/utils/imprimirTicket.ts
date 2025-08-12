// utils/imprimirTicket.ts
import type { TicketData } from "../components/Ticket/TicketGenerado";


const MODO_SIMULACION = import.meta.env.VITE_MODO_SIMULACION === "true" || import.meta.env.VITE_MODO_SIMULACION === true;

const apiUrl = import.meta.env.VITE_APP_API_URL;


export async function imprimirTicket(ticket: TicketData) {
  if (MODO_SIMULACION) {
    console.log("Simulación de impresión:", ticket);
    alert("Ticket simulado en pantalla"); 
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/api/imprimir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ticket),
    });

    if (!res.ok) throw new Error("Error al enviar a impresora");
    console.log("Ticket enviado a impresora térmica");
  } catch (err) {
    console.error(err);
  }
}
