// src/services/empresa.ts
import { api } from "../config/api";

export type Empresa = {
  id?: number;
  nombre: string;
  direccion?: string | null;
  telefono?: string | null;
  correo?: string | null;
  cif?: string | null;
};

export async function getEmpresa(): Promise<Empresa | null> {
  const { data } = await api.get<Empresa | null>("/empresa");
  if (!data || Object.keys(data || {}).length === 0) return null;
  return data;
}
