import { useEffect, useState, useContext } from "react";
import EmpresaForm from "./EmpresaForm";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import type { Empresa, EmpresaInput } from "../../types/empresa";
import "./EmpresaContainer.css";

export default function EmpresaContainer() {
  const { isLoggedIn } = useContext(AuthContext)!;

  // Tipo Empresa o null al inicio
  const [empresa, setEmpresa] = useState<Empresa | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<boolean>(false);

  useEffect(() => {
    fetchEmpresa();
  }, []);

  async function fetchEmpresa() {
    try {
      const data = (await authFetch(api("/api/empresa"))) as Empresa | null;

      if (!data || Object.keys(data).length === 0) {
        setEmpresa(null);
        setEditMode(true); // Modo creación si no hay datos
      } else {
        setEmpresa(data);
        setEditMode(false);
      }
      setError(null);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    }
  }

  async function handleSave(empresaData: EmpresaInput) {
    try {
      const method = empresa ? "PUT" : "POST";

      await authFetch(api("/api/empresa"), {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresaData),
      });

      toast.success(
        empresa ? "Empresa actualizada correctamente" : "Empresa creada correctamente"
      );
      setEditMode(false);
      fetchEmpresa();
    } catch (err: any) {
      toast.error("Error al guardar la empresa: " + (err.message || "Error desconocido"));
    }
  }

  if (error) {
    return <p className="empresa-error">Error: {error}</p>;
  }

  return (
    <div className="empresa-container">
      <h1 className="empresa-titulo">Empresa</h1>

      {isLoggedIn && editMode ? (
        <EmpresaForm
          empresaEdit={empresa}
          onSave={handleSave}
          onCancel={() => {
            if (empresa) setEditMode(false);
          }}
        />
      ) : empresa ? (
        <div className="empresa-detalle">
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>Dirección:</strong> {empresa.direccion}</p>
          <p><strong>Teléfono:</strong> {empresa.telefono}</p>
          <p><strong>Correo:</strong> {empresa.correo}</p>
          <p><strong>CIF:</strong> {empresa.cif}</p>
          {isLoggedIn && (
            <button className="empresa-btn" onClick={() => setEditMode(true)}>
              Editar Empresa
            </button>
          )}
        </div>
      ) : (
        <p>No hay empresa registrada.</p>
      )}
    </div>
  );
}
