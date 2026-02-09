// src/utils/impresion.ts
import { api } from "../config/api";
import { getEmpresa, type Empresa } from "../services/empresa";
import type { TicketData } from "../components/Ticket/TicketGenerado";

const MODO_SIMULACION = import.meta.env.VITE_MODO_SIMULACION === "true";

/** Asegura que mandamos un objeto empresa con strings (no undefined) */
function normalizeEmpresa(empresa: Empresa | null): Required<Empresa> {
  return {
    id: empresa?.id ?? 0,
    nombre: empresa?.nombre || "Mi Empresa",
    direccion: empresa?.direccion || "",
    telefono: empresa?.telefono || "",
    correo: empresa?.correo || "",
    cif: empresa?.cif || "",
  };
}

/**
 * Imprimir ticket de venta (envía a backend empresa + ticket).
 * Endpoint esperado en backend: POST /imprimir
 */
export async function imprimirTicket(
  ticket: TicketData,
  tipoPago: "efectivo" | "tarjeta"
) {
  const empresaDB = await getEmpresa();
  const empresa = normalizeEmpresa(empresaDB);

  if (MODO_SIMULACION) {
    // eslint-disable-next-line no-console
    console.log("[SIMULACIÓN] Ticket ->", { empresa, ticket, tipo_pago: tipoPago });
    alert("Ticket simulado (ver consola para payload)");
    return;
  }

  await api.post("/imprimir", {
    ...ticket,
    tipo_pago: tipoPago,
    empresa, // 👈 ahora el backend lo tiene fácil
  });
}

/**
 * Imprimir cierre de caja (incluye cabecera de empresa).
 * Endpoint esperado en backend: POST /cierre-caja/imprimir
 * Puedes pasar `payload` extra si tu backend lo usa (rangos, totales, etc.)
 */
export async function imprimirCierreCaja(payload?: Record<string, unknown>) {
  const empresaDB = await getEmpresa();
  const empresa = normalizeEmpresa(empresaDB);

  if (MODO_SIMULACION) {
    // eslint-disable-next-line no-console
    console.log("[SIMULACIÓN] Cierre de caja ->", { empresa, ...(payload || {}) });
    alert("Cierre de caja simulado (ver consola para payload)");
    return { ok: true };
  }

  const { data } = await api.post("/cierre-caja/imprimir", {
    empresa,
    ...(payload || {}),
  });
  return data;
}
