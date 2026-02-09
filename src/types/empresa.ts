// src/types/empresa.ts
export type Empresa = {
  id?: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  cif?: string | null;
  logo?: string | null; // 👈 NUEVO
};

export type EmpresaInput = Omit<Empresa, "id">;
