// src/components/Empresa/EmpresaForm.tsx
import { useState, useEffect } from "react";
import type { EmpresaInput } from "../../types/empresa";

interface Props {
  empresaEdit: EmpresaInput | null;
  onSave: (formData: FormData) => void;  // 👈 ahora FormData
  onCancel: () => void;
}

export default function EmpresaForm({ empresaEdit, onSave, onCancel }: Props) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [cif, setCif] = useState("");
  const [urlLogo, setUrlLogo] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (empresaEdit) {
      setNombre(empresaEdit.nombre || "");
      setDireccion(empresaEdit.direccion || "");
      setTelefono(empresaEdit.telefono || "");
      setCorreo(empresaEdit.correo || "");
      setCif(empresaEdit.cif || "");
      setUrlLogo(empresaEdit.logo || "");
      setFile(null);
    } else {
      setNombre(""); setDireccion(""); setTelefono(""); setCorreo(""); setCif("");
      setUrlLogo(""); setFile(null);
    }
  }, [empresaEdit]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData();
    fd.append("nombre", nombre);
    fd.append("direccion", direccion);
    fd.append("telefono", telefono);
    fd.append("correo", correo);
    fd.append("cif", cif);
    if (file) fd.append("logo", file);
    else if (urlLogo.trim()) fd.append("logo", urlLogo.trim());
    onSave(fd);
  }

  const preview = file ? URL.createObjectURL(file) : (urlLogo || "");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Field label="Nombre *">
        <input
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          required value={nombre} onChange={(e) => setNombre(e.target.value)}
          placeholder="Mi Empresa S.L."
        />
      </Field>

      <Field label="Dirección">
        <input
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          value={direccion} onChange={(e) => setDireccion(e.target.value)}
          placeholder="Calle Ejemplo 123, Ciudad"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="Teléfono">
          <input
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            value={telefono} onChange={(e) => setTelefono(e.target.value)}
            placeholder="+34 600 000 000"
          />
        </Field>
        <Field label="Correo">
          <input
            type="email"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            value={correo} onChange={(e) => setCorreo(e.target.value)}
            placeholder="facturas@miempresa.es"
          />
        </Field>
      </div>

      <Field label="CIF / NIF">
        <input
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          value={cif} onChange={(e) => setCif(e.target.value)}
          placeholder="B12345678"
        />
      </Field>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Field label="URL del logo">
          <input
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            value={urlLogo} onChange={(e) => { setUrlLogo(e.target.value); setFile(null); }}
            placeholder="https://ejemplo.com/logo.png"
          />
        </Field>
        <Field label="Subir logo (archivo)">
          <input
            type="file" accept="image/*"
            onChange={(e) => { setFile(e.target.files?.[0] || null); }}
            className="mt-1 w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-white hover:file:bg-sky-700"
          />
        </Field>
      </div>

      {preview && (
        <div className="flex items-center gap-3">
          <img src={preview} alt="Vista previa" className="h-16 rounded border border-neutral-200 object-contain" />
          <span className="text-xs text-neutral-500">Vista previa</span>
        </div>
      )}

      <div className="flex items-center gap-3 pt-1">
        <button type="submit" className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700">
          Guardar
        </button>
        <button type="button" onClick={onCancel} className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-300">
          Cancelar
        </button>
      </div>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-neutral-700">{label}</label>
      {children}
    </div>
  );
}
