export interface Empresa {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  cif: string;
}

export interface EmpresaInput {
  id?: number;           
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  cif: string;
}