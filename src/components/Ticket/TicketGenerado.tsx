import React from "react";
import { imprimirTicket } from "../../utils/impresion"; // 👈 nueva utilidad unificada
import { useEmpresa } from "../../hooks/useEmpresa";     // 👈 hook para mostrar cabecera en simulación

export interface TicketProduct {
  nombre: string;
  cantidad: number;
  precio?: number;
}

export interface TicketData {
  fecha: string | Date;
  productos: TicketProduct[];
  total: number | string;
  tipo_pago?: "efectivo" | "tarjeta" | "bizum";
}

interface TicketGeneradoProps {
  ticket: TicketData;
  modoSimulacion: boolean;
  tipoPago: "efectivo" | "tarjeta" | "bizum";
}

export const TicketGenerado: React.FC<TicketGeneradoProps> = ({
  ticket,
  modoSimulacion,
  tipoPago,
}) => {
  const { empresa } = useEmpresa();

  React.useEffect(() => {
    if (!modoSimulacion) {
      imprimirTicket(ticket, tipoPago);
    }
  }, [ticket, tipoPago, modoSimulacion]);

  if (!modoSimulacion) return null; // no pintar UI en impresión real

  return (
    <div className="mx-auto w-full max-w-sm rounded-xl border border-neutral-200 bg-white p-4 text-sm shadow-sm">
      {/* Cabecera empresa en simulación */}
      <div className="mb-3 text-center">
        {empresa?.nombre && (
          <p className="font-semibold text-neutral-900">{empresa.nombre}</p>
        )}
        {empresa?.direccion && (
          <p className="text-neutral-600">{empresa.direccion}</p>
        )}
        {(empresa?.telefono || empresa?.correo) && (
          <p className="text-neutral-600">
            {empresa.telefono ? `Tel: ${empresa.telefono}` : ""}
            {empresa.telefono && empresa.correo ? " · " : ""}
            {empresa.correo || ""}
          </p>
        )}
        {empresa?.cif && <p className="text-neutral-600">CIF: {empresa.cif}</p>}
        <p className="mt-1 text-neutral-700">
          {typeof ticket.fecha === "string"
            ? ticket.fecha
            : new Date(ticket.fecha).toLocaleString()}
        </p>
      </div>

      <hr className="my-2 border-neutral-200" />

      <div className="space-y-1">
        {ticket.productos.map((p, i) => (
          <div key={i} className="flex items-center justify-between">
            <span>
              {p.cantidad} × {p.nombre}
            </span>
            {typeof p?.precio === "number" && (
              <span className="tabular-nums">{(p.cantidad * p.precio).toFixed(2)} €</span>
            )}
          </div>
        ))}
      </div>

      <hr className="my-2 border-neutral-200" />

      <div className="flex items-center justify-between font-semibold">
        <span>Total</span>
        <span className="tabular-nums">
          {typeof ticket.total === "number"
            ? ticket.total.toFixed(2)
            : ticket.total}{" "}
          €
        </span>
      </div>

      <p className="mt-3 text-center text-xs text-neutral-500">
        Gracias por su compra
      </p>
    </div>
  );
};
