import { useEffect, useState, useContext } from "react";
import CategoriaList from "./CategoriaList";
import CategoriaForm from "./CategoriaForm";
import ProductoList from "../producto/ProductoList";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { toast } from 'react-toastify';
import { api } from "../../config/api";

export default function CategoriaContainer() {
  const { isLoggedIn } = useContext(AuthContext);
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]); 
  const [error, setError] = useState(null);
  const [categoriaEdit, setCategoriaEdit] = useState(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const data = await authFetch(api("/api/categorias"));
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleCategoriaClick(cat) {
    try {
      let data;
      if (!cat || cat.id == null) {
        // Productos sin categoría
        data = await authFetch(api("/api/productos"));
        data = data.filter(p => !p.categoriaId);
      } else {
        // Productos de categoría específica
        data = await authFetch(api(`/api/categorias/${cat.id}/productos`));
      }
      setProductos(data);
    } catch (err) {
      setError("Error al cargar productos: " + err.message);
    }
  }

  async function handleProductoClick(producto) {
    try {
      const body = {
        fecha: new Date(),
        tipo_pago: "efectivo",
        total: producto.precio,
        productos: [
          {
            productoId: producto.id,
            cantidad: 1,
          },
        ],
      };

      await authFetch(api("/api/tickets"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      toast.success(`Ticket creado para ${producto.nombre}`);
    } catch (err) {
      toast.error("Error al crear ticket: " + err.message);
    }
  }

  function handleEdit(cat) {
    setCategoriaEdit(cat);
  }

  function handleCancel() {
    setCategoriaEdit(null);
  }

  async function handleSave(categoria) {
    try {
      const method = categoria.id ? "PUT" : "POST";
      const url = categoria.id
        ? api(`/api/categorias/${categoria.id}`)
        : api("/api/categorias");

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoria),
      });

      toast.success(`Categoría ${categoria.id ? 'actualizada' : 'creada'} correctamente`);
      setCategoriaEdit(null);
      fetchCategorias();
    } catch (err) {
      toast.error("Error al guardar la categoría: " + err.message);
    }
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
        onDelete={isLoggedIn ? async (id) => {
          if (window.confirm("¿Eliminar categoría?")) {
            await authFetch(api(`/api/categorias/${id}`), { method: "DELETE" });
            fetchCategorias();
          }
        } : null}
        onClick={handleCategoriaClick}
      />

      {productos.length > 0 && (
        <ProductoList productos={productos} onProductoClick={handleProductoClick} />
      )}
    </>
  );
}
