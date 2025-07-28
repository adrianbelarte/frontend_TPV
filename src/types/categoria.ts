export type Categoria = {
  id: number; // obligatorio
  nombre: string;
  descripcion?: string;
  imagen?: string;
};

export type CategoriaInput = {
  id?: number;         // opcional para creación/edición
  nombre: string;
  descripcion?: string;
  imagen?: string;
};
