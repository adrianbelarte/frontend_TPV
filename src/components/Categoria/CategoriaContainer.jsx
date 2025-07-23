import { useEffect, useState, useContext } from "react";
import CategoriaList from "./CategoriaList";
import CategoriaForm from "./CategoriaForm";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { toast } from 'react-toastify';

export default function CategoriaContainer() {
  const { isLoggedIn } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState(null);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const data = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/categorias`);
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    }
  }

async function handleSave(categoria) {
  try {
    const method = categoria.id ? "PUT" : "POST";
    const url = categoria.id
      ? `${import.meta.env.VITE_BASE_URL}/api/categorias/${categoria.id}`
      : `${import.meta.env.VITE_BASE_URL}/api/categorias`;

    await authFetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(categoria),
    });

    await fetchCategorias();
    setCategoriaEdit(null);
    toast.success(`Categoría ${categoria.id ? "actualizada" : "creada"} con éxito`);
  } catch (err) {
    setError(err.message);
    toast.error(`Error: ${err.message}`);
  }
}


  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar esta categoría?")) return;

    try {
      const url = `${import.meta.env.VITE_BASE_URL}/api/categorias/${id}`;
      await authFetch(url, { method: "DELETE" });
      await fetchCategorias();
      toast.success("Categoría eliminada con éxito");
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`);
    }
  }

  function handleEdit(cat) {
    setCategoriaEdit(cat);
  }

  function handleCancel() {
    setCategoriaEdit(null);
  }

  return (
    <>
      <h1>Categorías</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {isLoggedIn && (
        <CategoriaForm
          onSave={handleSave}
          categoriaEdit={categoriaEdit}
          onCancel={handleCancel}
        />
      )}

      <CategoriaList
        categorias={categorias}
        onEdit={isLoggedIn ? handleEdit : null}
        onDelete={isLoggedIn ? handleDelete : null}
      />
    </>
  );
}
