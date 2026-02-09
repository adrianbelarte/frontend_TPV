// src/components/Empresa/EmpresaContainer.tsx
import { useEffect, useState, useContext } from "react";
import EmpresaForm from "./EmpresaForm";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import type { Empresa } from "../../types/empresa";
import { mediaUrl } from "../../utils/media";


export default function EmpresaContainer() {
  const { isLoggedIn } = useContext(AuthContext)!;
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchEmpresa(); }, []);

  async function fetchEmpresa() {
    try {
      setLoading(true);
      const { data } = await api.get<Empresa | null>("/empresa");
      if (!data || Object.keys(data || {}).length === 0) {
        setEmpresa(null);
        setEditMode(true);
      } else {
        setEmpresa(data);
        setEditMode(false);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(formData: FormData) {
    try {
      if (empresa?.id) {
        await api.put("/empresa", formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/empresa", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success(empresa?.id ? "Empresa actualizada correctamente" : "Empresa creada correctamente");
      setEditMode(false);
      fetchEmpresa();
    } catch (err: any) {
      toast.error("Error al guardar la empresa: " + (err.message || "Error desconocido"));
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-neutral-800">Empresa</h1>
        {isLoggedIn && empresa && !editMode && (
          <button
            onClick={() => setEditMode(true)}
            className="rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            Editar
          </button>
        )}
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Error: {error}
        </p>
      )}

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="px-5 py-4">
          {loading ? (
            <p className="text-sm text-neutral-500">Cargando…</p>
          ) : editMode ? (
            <EmpresaForm
              empresaEdit={empresa || null}
              onSave={handleSave}
              onCancel={() => { if (empresa) setEditMode(false); }}
            />
          ) : empresa ? (
            <div className="space-y-2 text-sm">
              {empresa.logo && (
                <div className="mb-2 flex justify-center">
                  <img src={mediaUrl(empresa.logo)} alt="Logo" className="h-16 object-contain" />
                </div>
              )}
              <Item label="Nombre" value={empresa.nombre} />
              <Item label="Dirección" value={empresa.direccion} />
              <Item label="Teléfono" value={empresa.telefono} />
              <Item label="Correo" value={empresa.correo} />
              <Item label="CIF" value={empresa.cif} />
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-sm text-neutral-600">No hay empresa registrada.</p>
              {isLoggedIn && (
                <button
                  onClick={() => setEditMode(true)}
                  className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
                >
                  Crear empresa
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Item({ label, value }: { label: string; value?: string | null }) {
  return (
    <p>
      <span className="font-semibold text-neutral-700">{label}:</span>{" "}
      <span className="text-neutral-800">{value || "-"}</span>
    </p>
  );
}
