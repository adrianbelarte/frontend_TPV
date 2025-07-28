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
