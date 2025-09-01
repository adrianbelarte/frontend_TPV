import { api } from "../config/api";
import { authFetch } from "./authFetch";

type ResumenCaja = {
  total_efectivo: number;
  total_tarjeta: number;
  total_general: number;
};

type ProductoVenta = {
  nombre: string;
  cantidad: number;
};

type CierreCajaData = {
  fecha: string;
  resumen: ResumenCaja;
  productos: ProductoVenta[];
};

export async function imprimirCierreCaja(cierre: CierreCajaData) {
  try {
    await authFetch(api("/api/imprimir-cierre"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cierre),
    });
  } catch (err: any) {
    console.error("Error al imprimir cierre:", err);
    alert("No se pudo imprimir el cierre de caja");
  }
}
