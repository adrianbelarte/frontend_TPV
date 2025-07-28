import { useEffect, useState, useContext } from "react";
import ProductoList from "./ProductoList";
import ProductoForm from "./ProductoForm";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { api } from "../../config/api"; // 💡 Importa el helper centralizado
import "./ProductoContainer.css";

export default function ProductoContainer() {
  const { isLoggedIn } = useContext(AuthContext);
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [productosExtras, setProductosExtras] = useState([]);
  const [error, setError] = useState(null);
  const [productoEdit, setProductoEdit] = useState(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProductosExtras();
  }, []);

  async function fetchProductos() {
    try {
      const data = await authFetch(api("/api/productos"));
      setProductos(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchCategorias() {
    try {
      const data = await authFetch(api("/api/categorias"));
      setCategorias(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function fetchProductosExtras() {
    try {
      const data = await authFetch(api("/api/productos"));
      setProductosExtras(data);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSave(producto) {
    try {
      const method = producto.id ? "PUT" : "POST";
      const url = producto.id
        ? api(`/api/productos/${producto.id}`)
        : api("/api/productos");

      await authFetch(url, {
        method,
        body: JSON.stringify(producto),
      });

      await fetchProductos();
      setProductoEdit(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleDelete(id) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    try {
      await authFetch(api(`/api/productos/${id}`), { method: "DELETE" });
      await fetchProductos();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="producto-container">
      <h1>Productos</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      {isLoggedIn && (
        <ProductoForm
          onSave={handleSave}
          productoEdit={productoEdit}
          onCancel={() => setProductoEdit(null)}
          categorias={categorias}
          productosExtras={productosExtras}
        />
      )}

      <ProductoList
        productos={productos}
        onEdit={isLoggedIn ? setProductoEdit : null}
        onDelete={isLoggedIn ? handleDelete : null}
      />
    </div>
  );
}
