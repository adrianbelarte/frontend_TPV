import { useEffect, useState, useContext } from "react";
import CategoriaList from "./CategoriaList";
import CategoriaForm from "./CategoriaForm";
import "./CategoriaContainer.css";
import ProductoList from "../Producto/ProductoList";
import { AuthContext } from "../../context/AuthContext";
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
  const [categoriaEdit, setCategoriaEdit] = useState<CategoriaInput | null>(null);

  useEffect(() => {
    fetchCategorias();
  }, []);

  // ✅ Axios directo
  async function fetchCategorias() {
    try {
      const res = await api.get<Categoria[]>("/categorias");
      setCategorias(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  async function handleCategoriaClick(cat: Categoria | null) {
    try {
      let res;
      if (!cat || cat.id == null) {
        res = await api.get<Producto[]>("/productos");
        setProductos(res.data.filter((p) => !p.categoriaId));
      } else {
        res = await api.get<Producto[]>(`/categorias/${cat.id}/productos`);
        setProductos(res.data);
      }
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

      await api.post("/tickets", body);
      toast.success(`Ticket creado para ${producto.nombre}`);
    } catch (err: any) {
      toast.error("Error al crear ticket: " + err.message);
    }
  }

  function handleEdit(cat: Categoria) {
    setCategoriaEdit(cat);
  }

  function handleCancel() {
    setCategoriaEdit(null);
  }

  async function handleSave(formData: FormData): Promise<void> {
    try {
      const id = formData.get("id");
      if (id) {
        await api.put(`/categorias/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        await api.post("/categorias", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(`Categoría ${id ? "actualizada" : "creada"} correctamente`);
      setCategoriaEdit(null);
      fetchCategorias();
    } catch (err: any) {
      toast.error("Error al guardar la categoría: " + err.message);
    }
  }

  return (
    <div className="categoria-container">
      <div>
        <h1>Categorías</h1>
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        {isLoggedIn && (
          <CategoriaForm
            onSave={handleSave}
            categoriaEdit={categoriaEdit}
            onCancel={handleCancel}
          />
        )}
      </div>

      <div style={{ flex: 1 }}>
        <CategoriaList
          categorias={categorias}
          onEdit={isLoggedIn ? handleEdit : undefined}
          onDelete={
            isLoggedIn
              ? async (id: number) => {
                  if (window.confirm("¿Eliminar categoría?")) {
                    await api.delete(`/categorias/${id}`);
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
            categorias={categorias}
            onProductoClick={handleProductoClick}
          />
        )}
      </div>
    </div>
  );
}
