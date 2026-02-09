import { useEffect, useMemo, useState } from "react";
import { api } from "../config/api";

/** Utilidades de validación muy simples (suficiente para UI) */
const ipRegex =
  /^(25[0-5]|2[0-4]\d|1?\d?\d)(\.(25[0-5]|2[0-4]\d|1?\d?\d)){3}$/;

function isValidIP(v: string) {
  return ipRegex.test(v.trim());
}
function isValidPort(v: number) {
  return Number.isFinite(v) && v > 0 && v < 65536;
}

type Msg = { kind: "idle" | "loading" | "ok" | "error"; text?: string };

export default function PrinterSettingsAdmin() {
  const [host, setHost] = useState("");
  const [port, setPort] = useState<number>(9100);
  const [msg, setMsg] = useState<Msg>({ kind: "idle" });
  const [isBusy, setIsBusy] = useState(false);

  // Carga inicial
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setIsBusy(true);
        const { data } = await api.get("/printer");
        if (!mounted) return;
        setHost(String(data?.host ?? ""));
        setPort(Number(data?.port ?? 9100));
      } catch {
        // silencio: si no hay config aún
      } finally {
        if (mounted) setIsBusy(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const ipValid = useMemo(() => isValidIP(host), [host]);
  const portValid = useMemo(() => isValidPort(port), [port]);
  const formValid = ipValid && portValid;

  const run = async <T,>(
    action: () => Promise<T>,
    okText: string,
    fallback = "Ha ocurrido un error"
  ) => {
    setMsg({ kind: "loading", text: "Procesando..." });
    setIsBusy(true);
    try {
      await action();
      setMsg({ kind: "ok", text: okText });
    } catch (e: any) {
      setMsg({
        kind: "error",
        text:
          e?.response?.data?.error ||
          e?.message ||
          fallback,
      });
    } finally {
      setIsBusy(false);
    }
  };

  const save = () =>
    run(
      () => api.post("/printer", { host: host.trim(), port }),
      "Configuración guardada correctamente"
    );

  const ping = () =>
    run(
      async () => {
        const { data } = await api.get("/printer/ping");
        // data.host, data.port si el backend los devuelve
        setMsg({
          kind: "ok",
          text: `Conexión OK: ${data?.host ?? host}:${data?.port ?? port}`,
        });
      },
      "Ping correcto"
    );

  const testTicket = () =>
    run(() => api.post("/printer/test-ticket"), "Ticket de prueba enviado");

  const testCierre = () =>
    run(() => api.post("/printer/test-cierre"), "Cierre de caja de prueba enviado");

  const drawer = () =>
    run(() => api.post("/printer/drawer"), "Cajón abierto");

  return (
    <div className="mx-auto max-w-3xl space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-neutral-800">
            Ajustes de Impresora ESC/POS (LAN)
          </h2>
          <p className="mt-1 text-sm text-neutral-500">
            Configura IP/puerto y prueba la conexión, ticket, cierre y cajón.
          </p>
        </div>
      </header>

      {/* Card de configuración */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_180px]">
          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              IP de la impresora
            </label>
            <input
              value={host}
              onChange={(e) => setHost(e.target.value)}
              placeholder="192.168.1.50"
              className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
                ipValid
                  ? "border-neutral-300 focus:ring-2 focus:ring-blue-200"
                  : "border-red-300 focus:ring-2 focus:ring-red-200"
              }`}
              disabled={isBusy}
              inputMode="numeric"
            />
            {!ipValid && host.length > 0 && (
              <p className="mt-1 text-xs text-red-600">
                IP no válida (formato: 0-255.0-255.0-255.0-255)
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-neutral-700">
              Puerto
            </label>
            <input
              type="number"
              value={Number.isFinite(port) ? port : 9100}
              onChange={(e) => setPort(parseInt(e.target.value || "9100", 10))}
              className={`w-full rounded-xl border px-3 py-2 outline-none transition ${
                portValid
                  ? "border-neutral-300 focus:ring-2 focus:ring-blue-200"
                  : "border-red-300 focus:ring-2 focus:ring-red-200"
              }`}
              disabled={isBusy}
              min={1}
              max={65535}
            />
            {!portValid && (
              <p className="mt-1 text-xs text-red-600">
                Puerto entre 1 y 65535
              </p>
            )}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={save}
            disabled={!formValid || isBusy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              !formValid || isBusy
                ? "cursor-not-allowed bg-neutral-300"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            Guardar
          </button>

          <button
            onClick={ping}
            disabled={!formValid || isBusy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${
              !formValid || isBusy
                ? "cursor-not-allowed bg-neutral-100 text-neutral-400"
                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
            }`}
          >
            Probar conexión
          </button>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 text-sm font-semibold tracking-wide text-neutral-500">
          Acciones
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={testTicket}
            disabled={isBusy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              isBusy ? "cursor-not-allowed bg-neutral-300" : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            Probar ticket
          </button>

          <button
            onClick={testCierre}
            disabled={isBusy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              isBusy ? "cursor-not-allowed bg-neutral-300" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            Probar cierre
          </button>

          <button
            onClick={drawer}
            disabled={isBusy}
            className={`rounded-xl px-4 py-2 text-sm font-semibold text-white transition ${
              isBusy ? "cursor-not-allowed bg-neutral-300" : "bg-amber-600 hover:bg-amber-700"
            }`}
          >
            Abrir cajón
          </button>
        </div>
      </div>

      {/* Mensajes de estado */}
      {msg.kind !== "idle" && (
        <div
          className={[
            "rounded-xl border p-3 text-sm",
            msg.kind === "loading" && "border-blue-200 bg-blue-50 text-blue-800",
            msg.kind === "ok" && "border-emerald-200 bg-emerald-50 text-emerald-800",
            msg.kind === "error" && "border-red-200 bg-red-50 text-red-800",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {msg.kind === "loading" ? "Procesando..." : msg.text}
        </div>
      )}

      {/* Nota de ayuda */}
      <p className="text-xs text-neutral-500">
        Consejo: para impresoras ESC/POS Ethernet, el puerto suele ser <b>9100</b>.  
        La impresora y el equipo deben estar en la misma red.
      </p>
    </div>
  );
}
