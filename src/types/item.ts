import type { Producto } from "./producto";

export interface ItemVenta {
  producto: Producto;
  cantidad: number;
}