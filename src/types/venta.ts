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

export type MetodoPago = "efectivo" | "tarjeta";
