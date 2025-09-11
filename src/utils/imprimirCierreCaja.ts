import { api } from "../config/api";

export async function imprimirCierreCaja() {
  try {
    const { data } = await api.post("/cierre-caja/imprimir"); 
    return data;
  } catch (err: any) {
    console.error("Error al imprimir cierre de caja:", err);
    throw err;
  }
}

