import { useEffect, useState, useContext } from "react";
import EmpresaForm from "./EmpresaForm";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { toast } from "react-toastify";

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
      // No hay empresa creada
      setEmpresa(null);
      setEditMode(true); // Mostrar formulario para crear
    } else {
      // Empresa existente
      setEmpresa(data);
      setEditMode(false); // Mostrar datos
    }
    setError(null);
  } catch (err) {
    setError(err.message || "Error desconocido");
  }
}

  async function handleSave(empresaData) {
    try {
      if (empresa) {
        // Actualizar empresa
        await authFetch(`${import.meta.env.VITE_BASE_URL}/api/empresa`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(empresaData),
        });
        toast.success("Empresa actualizada correctamente");
      } else {
        // Crear empresa nueva
        await authFetch(`${import.meta.env.VITE_BASE_URL}/api/empresa`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(empresaData),
        });
        toast.success("Empresa creada correctamente");
      }
      setEditMode(false);
      fetchEmpresa();
    } catch (err) {
      toast.error("Error al guardar la empresa: " + (err.message || "Error desconocido"));
    }
  }

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  // Si estamos en modo edición (crear o editar)
  if (isLoggedIn && editMode) {
    return (
      <>
        <h1>Empresa</h1>
        <EmpresaForm
          empresaEdit={empresa}
          onSave={handleSave}
          onCancel={() => {
            // Solo se puede cancelar si ya existe empresa, para no ocultar el form creación
            if (empresa) setEditMode(false);
          }}
        />
      </>
    );
  }

  // Si hay empresa y no estamos en edición
  if (empresa) {
    return (
      <>
        <h1>Empresa</h1>
        <div>
          <p><strong>Nombre:</strong> {empresa.nombre}</p>
          <p><strong>Dirección:</strong> {empresa.direccion}</p>
          <p><strong>Teléfono:</strong> {empresa.telefono}</p>
          <p><strong>Correo:</strong> {empresa.correo}</p>
          <p><strong>CIF:</strong> {empresa.cif}</p>
          {isLoggedIn && <button onClick={() => setEditMode(true)}>Editar Empresa</button>}
        </div>
      </>
    );
  }

  // Caso por si no está logueado y no hay empresa
  return (
    <>
      <h1>Empresa</h1>
      <p>No hay empresa registrada.</p>
    </>
  );
}
