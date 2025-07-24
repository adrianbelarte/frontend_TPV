export async function imprimirTicket(ticket, tipoPago) {
  try {
    const res = await fetch('http://localhost:3001/imprimir-ticket', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticket, tipoPago }),
    });
    if (!res.ok) {
      throw new Error('Error al imprimir el ticket');
    }
  } catch (error) {
    console.error('Error en imprimirTicket:', error);
  }
}
