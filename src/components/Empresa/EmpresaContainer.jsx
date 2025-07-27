import { useEffect, useState, useContext } from "react";
import EmpresaForm from "./EmpresaForm";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { toast } from "react-toastify";
import "./EmpresaContainer.css";

export default function EmpresaContainer() {
  const { isLoggedIn } = useContext(AuthContext);
  const [empresa, setEmpresa] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchEmpresa();
  }, []);

  async function fetchEmpresa() {
    try {
      const data = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/empresa`);
      if (data && Object.keys(data).length === 0) {
        setEmpresa(null);
        setEditMode(true); // Modo creación
      } else {
        setEmpresa(data);
        setEditMode(false);
      }
      setError(null);
    } catch (err) {
      setError(err.message || "Error desconocido");
    }
  }

  async function handleSave(empresaData) {
    try {
      const method = empresa ? "PUT" : "POST";
      await authFetch(`${import.meta.env.VITE_BASE_URL}/api/empresa`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(empresaData),
      });
      toast.success(empresa ? "Empresa actualizada correctamente" : "Empresa creada correctamente");
      setEditMode(false);
      fetchEmpresa();
    } catch (err) {
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
