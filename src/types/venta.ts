// types/venta.ts
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

export interface VentaItem {
  producto: Producto;
  cantidad: number;
}


export interface TicketProducto {
  nombre: string;
  cantidad: number;
  precio: number;
  total: number;
}

// Añade estos campos opcionales a tu interfaz TicketData existente:

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

// Si tienes otros tipos, mantenlos igual
export interface VentaItem {
  producto: Producto;
  cantidad: number;
}

export type MetodoPago = "efectivo" | "tarjeta";