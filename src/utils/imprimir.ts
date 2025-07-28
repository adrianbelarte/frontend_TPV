type Ticket = {
  id: number;
  // agrega aquí otros campos que uses en ticket
};

export async function imprimirTicket(ticket: Ticket, tipoPago: "efectivo" | "tarjeta"): Promise<void> {
  try {
    const res = await fetch('http://localhost:3001/imprimir-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, tipoPago }),
    });

    if (!res.ok) {
      // Intentamos leer mensaje de error del backend
      let errorMessage = 'Error al imprimir el ticket';
      try {
        const errorData = await res.json();
        if (errorData?.message) errorMessage = errorData.message;
      } catch {
        // ignorar error al parsear JSON
      }
      throw new Error(errorMessage);
    }
  } catch (error) {
    console.error('Error en imprimirTicket:', error);
    throw error; // relanzar para que el llamador lo maneje
  }
}
