import { useEffect, useState, useContext } from "react";
import ProductoList from "../Producto/ProductoList";
import ProductoForm from "../Producto/ProductoForm";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../config/api"; // nuestro cliente Axios
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

  // 🚀 Usando Axios
  async function fetchProductos() {
    try {
      const res = await api.get<Producto[]>("/productos");
      setProductos(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function fetchCategorias() {
    try {
      const res = await api.get<Categoria[]>("/categorias");
      setCategorias(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function fetchProductosExtras() {
    try {
      const res = await api.get<ProductoExtra[]>("/productos");
      setProductosExtras(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleSave(producto: ProductoInput) {
    try {
      if (producto.id) {
        await api.put(`/productos/${producto.id}`, producto);
      } else {
        await api.post("/productos", producto);
      }

      await fetchProductos();
      setProductoEdit(null);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?")) return;

    try {
      await api.delete(`/productos/${id}`);
      await fetchProductos();
    } catch (err: any) {
      setError(err.message);
    }
  }

  return (
    <div className="producto-container">
      <h1>Productos</h1>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}

      <div className="producto-panel">
        {isLoggedIn && (
          <div className="producto-form-wrapper">
            <ProductoForm
              onSave={handleSave}
              productoEdit={productoEdit}
              onCancel={() => setProductoEdit(null)}
              categorias={categorias}
              productosExtras={productosExtras}
            />
          </div>
        )}

        <div className="producto-list-wrapper">
          <ProductoList
            productos={productos}
            categorias={categorias}
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
      </div>
    </div>
  );
}
