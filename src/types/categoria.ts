export type Categoria = {
  id: number; // obligatorio
  nombre: string;
  imagen?: string;
  imagen_url?: string;
};

export type CategoriaInput = {
  id?: number;         // opcional para creación/edición
  nombre: string;
  imagen?: string;
};


