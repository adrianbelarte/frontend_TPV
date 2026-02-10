import { api } from "../config/api";

const MODO_SIMULACION = import.meta.env.VITE_MODO_SIMULACION === "true";

/**
 * Abre el cajón portamonedas físico
 */
export async function abrirCajon(): Promise<void> {
  try {
    if (MODO_SIMULACION) {
      console.log("[SIMULACIÓN] Abriendo cajón...");
      alert("💰 Cajón abierto (simulación)");
      return;
    }

    // Llamada al backend para abrir cajón
    await api.post("/abrir-cajon");
    
    console.log("✅ Cajón abierto");
  } catch (error) {
    console.error("❌ Error al abrir cajón:", error);
    throw new Error("Error al abrir el cajón");
  }
}
