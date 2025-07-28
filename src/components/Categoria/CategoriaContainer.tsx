import { useEffect, useState, useContext } from "react";
import CategoriaList from "./CategoriaList";
import CategoriaForm from "./CategoriaForm";
import ProductoList from "../Producto/ProductoList";
import { AuthContext } from "../../context/AuthContext";
import { authFetch } from "../../utils/authFetch";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import type { Categoria, CategoriaInput } from "../../types/categoria";
import type { Producto } from "../../types/producto";


export default function CategoriaContainer() {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    return <div>Error: no hay contexto de autenticación</div>;
  }
  const { isLoggedIn } = authContext;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [error, setError] = useState<string | null>(null);
  // Cambia el estado a CategoriaInput para que id sea opcional
  const [categoriaEdit, setCategoriaEdit] = useState<CategoriaInput | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  async function fetchCategorias() {
    try {
      const data = (await authFetch(api("/api/categorias"))) as Categoria[];
      setCategorias(data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCategoriaClick(cat: Categoria | null) {
    try {
      let data: Producto[];
      if (!cat || cat.id == null) {
        data = (await authFetch(api("/api/productos"))) as Producto[];
        data = data.filter((p) => !p.categoriaId);
      } else {
        data = (await authFetch(api(`/api/categorias/${cat.id}/productos`))) as Producto[];
      }
      setProductos(data);
    } catch (err: any) {
      setError("Error al cargar productos: " + err.message);
    }
  }

  async function handleProductoClick(producto: Producto) {
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
    } catch (err: any) {
      toast.error("Error al crear ticket: " + err.message);
    }
  }

  function handleEdit(cat: Categoria) {
    setCategoriaEdit(cat); // cat tiene id obligatorio, asigna a estado con id opcional, es seguro
  }

  function handleCancel() {
    setCategoriaEdit(null);
  }

  // Aquí la función es async y recibe CategoriaInput (id opcional)
  async function handleSave(categoria: CategoriaInput): Promise<void> {
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

      toast.success(
        `Categoría ${categoria.id ? "actualizada" : "creada"} correctamente`
      );
      setCategoriaEdit(null);
      fetchCategorias();
    } catch (err: any) {
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
        onEdit={isLoggedIn ? handleEdit : undefined}
        onDelete={
          isLoggedIn
            ? async (id: number) => {
                if (window.confirm("¿Eliminar categoría?")) {
                  await authFetch(api(`/api/categorias/${id}`), { method: "DELETE" });
                  fetchCategorias();
                }
              }
            : undefined
        }
        onClick={handleCategoriaClick}
      />

      {productos.length > 0 && (
      <ProductoList 
        productos={productos} 
        categorias={categorias}    // <----- Aquí se añade
        onProductoClick={handleProductoClick} 
      />
    )}
    </>
  );
}
