// src/components/Ticket/TicketGenerado.tsx

import type { FC } from "react";

export interface TicketData {
  fecha: string;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio?: number;
  }>;
  total: string;
  tipo_pago: "efectivo" | "tarjeta";
  efectivoRecibido?: number;  // 👈 NUEVO
  cambio?: number;             // 👈 NUEVO
}

interface TicketGeneradoProps {
  ticket: TicketData;
  modoSimulacion: boolean;
  tipoPago: "efectivo" | "tarjeta";
}

export const TicketGenerado: FC<TicketGeneradoProps> = ({ 
  ticket, 
  modoSimulacion, 
  tipoPago 
}) => {
  return (
    <div className="max-w-xs p-4 bg-white border border-gray-300 rounded-lg shadow-md font-mono text-sm">
      <div className="text-center border-b border-gray-300 pb-2 mb-2">
        <h3 className="font-bold text-lg">TPV Grupo Manhattan</h3>
        <p className="text-xs text-gray-600">{ticket.fecha}</p>
      </div>

      <div className="mb-3">
        {ticket.productos.map((prod, idx) => (
          <div key={idx} className="flex justify-between py-1">
            <span>
              {prod.nombre} x{prod.cantidad}
            </span>
            {prod.precio && (
              <span>{(prod.precio * prod.cantidad).toFixed(2)} €</span>
            )}
          </div>
        ))}
      </div>

      <div className="border-t border-gray-300 pt-2 mb-2">
        <div className="flex justify-between font-bold text-base">
          <span>TOTAL:</span>
          <span>{ticket.total} €</span>
        </div>
      </div>

      <div className="border-t border-gray-300 pt-2 mb-2">
        <div className="flex justify-between">
          <span>Método de pago:</span>
          <span className="font-semibold uppercase">{tipoPago}</span>
        </div>
      </div>

      {/* 👇 NUEVO: Mostrar efectivo y cambio */}
      {ticket.tipo_pago === "efectivo" && ticket.efectivoRecibido && (
        <div className="border-t border-gray-300 pt-2 mb-2 bg-green-50 p-2 rounded">
          <div className="flex justify-between text-green-700">
            <span>Efectivo recibido:</span>
            <span className="font-semibold">{ticket.efectivoRecibido.toFixed(2)} €</span>
          </div>
          <div className="flex justify-between text-green-800 font-bold">
            <span>Cambio:</span>
            <span>{ticket.cambio?.toFixed(2)} €</span>
          </div>
        </div>
      )}

      {modoSimulacion && (
        <div className="text-center text-xs text-orange-600 mt-2 italic">
          (Modo simulación)
        </div>
      )}

      <div className="text-center text-xs text-gray-500 mt-3 border-t border-gray-200 pt-2">
        Gracias por su compra
      </div>
    </div>
  );
};
