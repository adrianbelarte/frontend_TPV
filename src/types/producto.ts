// types/producto.ts
export type ProductoEdit = {
  id?: number;
  nombre: string;
  precio: number;
  imagen?: string;
  categoriaId?: number;
  extras?: { id: number }[]; // puede ser más detallado si lo necesitas
};

export type ProductoExtra = {
  id: number;
  nombre: string;
  precio: number;
  categoriaId?: number;
  imagen?: string;
};

export type Producto = {
  id: number;
  nombre: string;
  precio: number;
  categoriaId?: number;
  imagen?: string;  // <-- aquí la agregas
  extras?: any[];
};

export type ProductoInput = {
  id?: number;
  nombre: string;
  precio: number;
  imagen?: string;
  categoriaId?: number;
  extras?: number[];
};
