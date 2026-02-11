const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export interface Cierre {
  id: number;
  fecha: string;
  total_efectivo: number;
  total_tarjeta: number;
  total_general: number;
  reprinted_count?: number;
}

export async function getCierres() {
  const res = await fetch(`${API_URL}/cierres`);
  if (!res.ok) throw new Error('Error cargando cierres');
  return res.json();
}

export async function reimprimirCierre(id: number) {
  const res = await fetch(`${API_URL}/cierres/${id}/reimprimir`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Error al reimprimir cierre');
  return res.json();
}
