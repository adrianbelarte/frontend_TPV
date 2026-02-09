import { useEffect, useState, useContext } from "react";
import CategoriaList from "./CategoriaList";
import CategoriaForm from "./CategoriaForm";
import ProductoList from "../Producto/ProductoList";
import ProductoForm from "../Producto/ProductoForm";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { api } from "../../config/api";
import type { Categoria, CategoriaInput } from "../../types/categoria";
import type { Producto, ProductoInput } from "../../types/producto";

export default function CategoriaContainer() {
  const authContext = useContext(AuthContext);
  if (!authContext) return <div>Error: no hay contexto de autenticación</div>;
  const { isLoggedIn } = authContext;

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);

  // UI estados
  const [categoriaEdit, setCategoriaEdit] = useState<CategoriaInput | null>(null);
  const [showCategoriaModal, setShowCategoriaModal] = useState(false);

  // Modal de productos por categoría
  const [productosCat, setProductosCat] = useState<Producto[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<Categoria | null>(null);
  const [showProductosModal, setShowProductosModal] = useState(false);

  // Modal editar/crear producto
  const [productoEdit, setProductoEdit] = useState<ProductoInput | null>(null);
  const [showProductoFormModal, setShowProductoFormModal] = useState(false);

  useEffect(() => {
    fetchCategorias();
  }, []);

  // Atajos: Esc o Alt+← para volver en el modal de productos
  useEffect(() => {
    if (!showProductosModal) return;
    function onKey(e: KeyboardEvent) {
      const altLeft = e.altKey && e.key === "ArrowLeft";
      if (e.key === "Escape" || altLeft) {
        setShowProductosModal(false);
        setCategoriaSeleccionada(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showProductosModal]);

  async function fetchCategorias() {
    try {
      const res = await api.get<Categoria[]>("/categorias");
      setCategorias(res.data);
    } catch (err: any) {
      setError(err.message);
    }
  }

  // Abrir listado de productos (en modal) para una categoría
  async function handleOpenProductos(cat: Categoria) {
    try {
      setCategoriaSeleccionada(cat);
      const res = await api.get<Producto[]>(`/categorias/${cat.id}/productos`);
      setProductosCat(res.data);
      setShowProductosModal(true);
    } catch (err: any) {
      setError("Error al cargar productos: " + err.message);
    }
  }

  // Guardar categoría (crear/editar)
  async function handleSaveCategoria(formData: FormData): Promise<void> {
    try {
      const id = formData.get("id");
      if (id) {
        await api.put(`/categorias/${id}`, formData, { headers: { "Content-Type": "multipart/form-data" } });
      } else {
        await api.post("/categorias", formData, { headers: { "Content-Type": "multipart/form-data" } });
      }
      toast.success(`Categoría ${id ? "actualizada" : "creada"} correctamente`);
      setCategoriaEdit(null);
      setShowCategoriaModal(false);
      await fetchCategorias();
    } catch (err: any) {
      toast.error("❌ Error al guardar: " + err.message);
    }
  }

  async function handleDeleteCategoria(id: number) {
    if (!window.confirm("¿Eliminar esta categoría?")) return;
    try {
      await api.delete(`/categorias/${id}`);
      toast.success("Categoría eliminada");
      await fetchCategorias();
    } catch (err: any) {
      toast.error("❌ Error al eliminar: " + err.message);
    }
  }

  // ----- Productos: editar / crear / borrar dentro del modal -----

  function openCrearProductoEnCategoria() {
    if (!categoriaSeleccionada) return;
    setProductoEdit({
      nombre: "",
      precio: 0,
      imagen: "",
      categoriaId: categoriaSeleccionada.id, // preseleccionada
    });
    setShowProductoFormModal(true);
  }

  function openEditarProducto(p: Producto) {
    setProductoEdit({
      id: p.id,
      nombre: p.nombre,
      precio: p.precio,
      imagen: p.imagen,
      categoriaId: p.categoriaId,
    });
    setShowProductoFormModal(true);
  }

  async function handleSaveProducto(producto: ProductoInput) {
    try {
      if (producto.id) await api.put(`/productos/${producto.id}`, producto);
      else await api.post("/productos", producto);

      toast.success(`Producto ${producto.id ? "actualizado" : "creado"} correctamente`);

      if (categoriaSeleccionada) {
        const res = await api.get<Producto[]>(`/categorias/${categoriaSeleccionada.id}/productos`);
        setProductosCat(res.data);
      }

      setProductoEdit(null);
      setShowProductoFormModal(false);
    } catch (err: any) {
      toast.error("❌ Error al guardar producto: " + err.message);
    }
  }

  async function handleDeleteProducto(id: number) {
    if (!window.confirm("¿Eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      toast.success("Producto eliminado");

      if (categoriaSeleccionada) {
        const res = await api.get<Producto[]>(`/categorias/${categoriaSeleccionada.id}/productos`);
        setProductosCat(res.data);
      }
    } catch (err: any) {
      toast.error("❌ Error al eliminar producto: " + err.message);
    }
  }

  return (
    <div className="mx-auto max-w-screen-2xl p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-800">Categorías</h1>

        {isLoggedIn && (
          <button
            onClick={() => { setCategoriaEdit(null); setShowCategoriaModal(true); }}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 active:bg-sky-800"
          >
            <span className="text-lg leading-none">+</span>
            <span>Nueva</span>
          </button>
        )}
      </div>

      {error && (
        <p className="mb-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      {/* Panel: listado de categorías */}
      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <header className="border-b border-neutral-100 px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-700">Listado de Categorías</h2>
          <p className="text-xs text-neutral-500">Haz clic en una categoría para ver sus productos.</p>
        </header>

        <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
          <CategoriaList
            categorias={categorias}
            onClick={handleOpenProductos}
            onEdit={
              isLoggedIn
                ? (cat) => { setCategoriaEdit({ id: cat.id, nombre: cat.nombre, imagen: cat.imagen }); setShowCategoriaModal(true); }
                : undefined
            }
            onDelete={isLoggedIn ? handleDeleteCategoria : undefined}
          />
        </div>
      </div>

      {/* MODAL: Crear/Editar categoría */}
      {showCategoriaModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => { setShowCategoriaModal(false); setCategoriaEdit(null); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                {categoriaEdit?.id ? "Editar Categoría" : "Nueva Categoría"}
              </h3>
              <button
                onClick={() => { setShowCategoriaModal(false); setCategoriaEdit(null); }}
                className="rounded-md border border-neutral-200 px-2 py-1 text-sm hover:bg-neutral-50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>

            <div className="p-5">
              <CategoriaForm
                onSave={handleSaveCategoria}
                categoriaEdit={categoriaEdit}
                onCancel={() => { setShowCategoriaModal(false); setCategoriaEdit(null); }}
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Productos de la categoría (listado + acciones de producto) */}
      {showProductosModal && categoriaSeleccionada && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="productos-modal-title"
        >
          <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl">
            {/* Header sticky con botón volver llamativo */}
            <div className="sticky top-0 z-10 border-b border-neutral-100 bg-white/95 backdrop-blur px-5 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => { setShowProductosModal(false); setCategoriaSeleccionada(null); }}
                    className="group inline-flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
                    aria-label="Volver a categorías"
                    title="Volver a categorías (Esc o Alt+←)"
                  >
                    <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 15.707a1 1 0 01-1.414 0l-5-5a1 1 0 010-1.414l5-5a1 1 0 111.414 1.414L8.414 9H17a1 1 0 110 2H8.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    <span>Volver a categorías</span>
                  </button>

                  <div className="ml-2">
                    <p className="text-xs text-neutral-500">Categorías /</p>
                    <h3 id="productos-modal-title" className="text-base font-semibold text-neutral-800">
                      {categoriaSeleccionada.nombre}
                    </h3>
                  </div>
                </div>

                {isLoggedIn && (
                  <button
                    onClick={openCrearProductoEnCategoria}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-semibold hover:bg-neutral-50"
                  >
                    + Crear producto
                  </button>
                )}
              </div>
            </div>

            {/* Contenido scrollable */}
            <div className="px-5 py-4 max-h-[70vh] overflow-y-auto">
              {productosCat.length > 0 ? (
                <ProductoList
                  productos={productosCat}
                  categorias={categorias}
                  onEdit={isLoggedIn ? openEditarProducto : undefined}
                  onDelete={isLoggedIn ? handleDeleteProducto : undefined}
                />
              ) : (
                <p className="text-sm text-neutral-500">No hay productos en esta categoría.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Form de producto (crear/editar) */}
      {showProductoFormModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => { setShowProductoFormModal(false); setProductoEdit(null); }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                {productoEdit?.id ? "Editar producto" : "Nuevo producto"}
              </h3>
              <button
                onClick={() => { setShowProductoFormModal(false); setProductoEdit(null); }}
                className="rounded-md border border-neutral-200 px-2 py-1 text-sm hover:bg-neutral-50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <ProductoForm
                key={productoEdit?.id ?? "new"}               // fuerza remount
                onSave={handleSaveProducto}
                productoEdit={productoEdit}
                onCancel={() => { setShowProductoFormModal(false); setProductoEdit(null); }}
                categorias={categorias}
                defaultCategoriaId={categoriaSeleccionada?.id} // preselecciona
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
