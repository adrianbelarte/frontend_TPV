import { useEffect, useState, useContext } from "react";
import ProductoList from "../Producto/ProductoList";
import ProductoForm from "../Producto/ProductoForm";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { api } from "../../config/api";
import type { Categoria } from "../../types/categoria";
import type { Producto, ProductoExtra, ProductoInput } from "../../types/producto";
import "./ProductoContainer.css";

export default function ProductoContainer() {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return <div>Error: No hay contexto de autenticación</div>;
  }

  const { isLoggedIn } = authContext;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosExtras, setProductosExtras] = useState<ProductoExtra[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [productoEdit, setProductoEdit] = useState<ProductoInput | null>(null);

  useEffect(() => {
    fetchProductos();
    fetchCategorias();
    fetchProductosExtras();
  }, []);

  async function fetchProductos() {
    try {
      const data = await authFetch(api("/api/productos"));
      setProductos(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function fetchCategorias() {
    try {
      const data = await authFetch(api("/api/categorias"));
      setCategorias(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function fetchProductosExtras() {
    try {
      const data = await authFetch(api("/api/productos"));
      setProductosExtras(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleSave(producto: ProductoInput) {
    try {
      const method = producto.id ? "PUT" : "POST";
      const url = producto.id
        ? api(`/api/productos/${producto.id}`)
        : api("/api/productos");

      await authFetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(producto),
      });

      await fetchProductos();
      setProductoEdit(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    try {
      await authFetch(api(`/api/productos/${id}`), { method: "DELETE" });
      await fetchProductos();
    } catch (err: any) {
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

    {/* Aquí va el ProductoList con las props corregidas */}
    <ProductoList
      productos={productos}
      categorias={categorias} // <-- Pasamos las categorías aquí
      onEdit={
        isLoggedIn
          ? (producto) =>
              setProductoEdit({
                id: producto.id,
                nombre: producto.nombre,
                precio: producto.precio,
                categoriaId: producto.categoriaId,
                imagen: producto.imagen,
                extras: producto.extras?.map((e: any) => e.id) ?? [],
              })
          : undefined
      }
      onDelete={isLoggedIn ? handleDelete : undefined}
    />
  </div>
);
}
