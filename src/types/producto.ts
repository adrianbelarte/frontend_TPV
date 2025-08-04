// types/producto.ts
export type ProductoEdit = {
  id?: number;
  nombre: string;
  precio: number;
  imagen?: string;
  categoriaId?: number;
  extras?: { id: number }[];
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
  imagen?: string;  
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
