import type { TicketData } from "../components/Ticket/TicketGenerado";

const MODO_SIMULACION = import.meta.env.VITE_MODO_SIMULACION === "true";
const apiUrl = import.meta.env.VITE_APP_API_URL;

export async function imprimirTicket(ticket: TicketData, tipoPago: "efectivo" | "tarjeta") {
  if (MODO_SIMULACION) {
    console.log("Simulación de impresión:", ticket, tipoPago);
    alert("Ticket simulado en pantalla");
    return;
  }

  try {
    const res = await fetch(`${apiUrl}/api/imprimir`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...ticket,
        tipo_pago: tipoPago,
      }),
    });

    if (!res.ok) throw new Error("Error al enviar a impresora");
    console.log("Ticket enviado a impresora térmica");
  } catch (err) {
    console.error(err);
    throw err; // Para que el componente que llama capture el error
  }
}
