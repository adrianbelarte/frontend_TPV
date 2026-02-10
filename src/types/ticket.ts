import type { Producto } from "./producto";

export type TicketProducto = {
  cantidad: number;
  productoId: number;
};

export type ProductoConTicketProducto = Producto & {
  TicketProducto: TicketProducto;
};

export type Ticket = {
  id: number;
  fecha?: string;
  tipo_pago?: string;
  total: number;
  productos: ProductoConTicketProducto[];
};

export interface TicketData {
  fecha: string;
  productos: Array<{
    nombre: string;
    cantidad: number;
    precio?: number; // 👈 asegúrate de tener esto
  }>;
  total: string;
  tipo_pago: "efectivo" | "tarjeta";
  efectivoRecibido?: number;  // 👈 NUEVO
  cambio?: number;             // 👈 NUEVO
}