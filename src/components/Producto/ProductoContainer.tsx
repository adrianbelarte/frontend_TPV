import { useEffect, useMemo, useState, useContext } from "react";
import ProductoList from "../Producto/ProductoList";
import ProductoForm from "../Producto/ProductoForm";
import { AuthContext } from "../../context/AuthContext";
import { api } from "../../config/api";
import type { Categoria } from "../../types/categoria";
import type { Producto, ProductoInput } from "../../types/producto";

type SelectedKey = number | "general";

export default function ProductoContainer() {
  const authContext = useContext(AuthContext);
  if (!authContext) return <div className="text-red-600">Error: No hay contexto de autenticación</div>;
  const { isLoggedIn } = authContext;

  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [selected, setSelected] = useState<SelectedKey>("general");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [productoEdit, setProductoEdit] = useState<ProductoInput | null>(null);

  // 👉 nueva: categoría por defecto para el modal de creación
  const [defaultCategoriaId, setDefaultCategoriaId] = useState<number | undefined>(undefined);

  useEffect(() => {
    (async () => {
      try {
        await Promise.all([fetchProductos(), fetchCategorias()]);
      } catch (e: any) {
        setError(e?.message || "Error inicial");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function fetchProductos() {
    try {
      const res = await api.get<Producto[]>("/productos");
      setProductos(res.data);
    } catch (err: any) {
      setError(err.message || "Error al obtener productos");
    }
  }

  async function fetchCategorias() {
    try {
      const res = await api.get<Categoria[]>("/categorias");
      setCategorias(res.data);
    } catch (err: any) {
      setError(err.message || "Error al obtener categorías");
    }
  }

  async function handleSave(producto: ProductoInput) {
    try {
      const payload: ProductoInput = {
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        // si el form no trae categoriaId (usuario no tocó el select), usamos la default del botón
        categoriaId: producto.categoriaId ?? defaultCategoriaId,
      };

      if (payload.id) await api.put(`/productos/${payload.id}`, payload);
      else await api.post("/productos", payload);

      await fetchProductos();
      setProductoEdit(null);
      setShowCreateModal(false);

      // Mantener UI en la categoría del producto creado/actualizado
      setSelected(payload.categoriaId ?? "general");
      // limpiar la categoría por defecto después de usarla
      setDefaultCategoriaId(undefined);
    } catch (err: any) {
      setError(err.message || "Error al guardar");
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("¿Seguro que quieres eliminar este producto?")) return;
    try {
      await api.delete(`/productos/${id}`);
      await fetchProductos();
    } catch (err: any) {
      setError(err.message || "Error al eliminar");
    }
  }

  const countsByCategoria = useMemo(() => {
    const map = new Map<number, number>();
    categorias.forEach((c) => map.set(c.id, 0));
    for (const p of productos) {
      if (p.categoriaId) map.set(p.categoriaId, (map.get(p.categoriaId) ?? 0) + 1);
    }
    return map;
  }, [productos, categorias]);

  const productosSinCategoria = useMemo(
    () => productos.filter((p) => !p.categoriaId),
    [productos]
  );

  const productosFiltrados = useMemo(() => {
    if (selected === "general") return productosSinCategoria;
    return productos.filter((p) => p.categoriaId === selected);
  }, [productos, productosSinCategoria, selected]);

  const categoriaActiva =
    selected === "general" ? null : categorias.find((c) => c.id === selected) ?? null;

  return (
    <div className="mx-auto max-w-screen-2xl p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-neutral-800">Productos</h1>

        {/* Botón superior: crear en GENERAL (sin categoría) */}
        {isLoggedIn && (
          <button
            onClick={() => {
              setProductoEdit(null);
              setDefaultCategoriaId(undefined); // 👉 forzar "general"
              setShowCreateModal(true);
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 active:bg-sky-800"
          >
            <span className="text-lg leading-none">+</span>
            <span>Nuevo</span>
          </button>
        )}
      </div>

      {error && <p className="mb-3 text-sm text-red-600">Error: {error}</p>}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sidebar categorías */}
        <aside className="lg:col-span-4 xl:col-span-3">
          {/* Altura automática; sin h-[calc(...)] */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <header className="border-b border-neutral-100 bg-white px-4 py-3">
              <h2 className="text-lg font-semibold text-neutral-700">Categorías</h2>
            </header>

            <div className="p-3">
              <ul className="space-y-2">
                <li>
                  <button
                    onClick={() => setSelected("general")}
                    className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                      selected === "general"
                        ? "border-sky-300 bg-sky-50"
                        : "border-neutral-200 bg-white hover:bg-neutral-50"
                    }`}
                  >
                    <div>
                      <p className="font-medium">General (sin categoría)</p>
                      <p className="text-xs text-neutral-500">Productos sin asignar</p>
                    </div>
                    <span className="rounded-md border border-neutral-200 px-2 text-xs">
                      {productosSinCategoria.length}
                    </span>
                  </button>
                </li>

                {categorias.map((cat) => (
                  <li key={cat.id}>
                    <button
                      onClick={() => setSelected(cat.id)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left transition ${
                        selected === cat.id
                          ? "border-sky-300 bg-sky-50"
                          : "border-neutral-200 bg-white hover:bg-neutral-50"
                      }`}
                    >
                      <div>
                        <p className="font-medium">{cat.nombre}</p>
                        <p className="text-xs text-neutral-500">Ver productos</p>
                      </div>
                      <span className="rounded-md border border-neutral-200 px-2 text-xs">
                        {countsByCategoria.get(cat.id) ?? 0}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </aside>

        {/* Panel listado */}
        <section className="lg:col-span-8 xl:col-span-9">
          {/* Altura automática del contenedor; el scroll se limita SOLO al listado */}
          <div className="flex flex-col rounded-2xl border border-neutral-200 bg-white shadow-sm">
            <header className="border-b border-neutral-100 bg-white px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-neutral-700">
                    {categoriaActiva ? categoriaActiva.nombre : "General (sin categoría)"}
                  </h2>
                  <p className="text-xs text-neutral-500">
                    {loading ? "Cargando…" : `${productosFiltrados.length} producto(s)`}
                  </p>
                </div>

                {/* Botón de cabecera: crear con categoría ACTUAL (si es general, queda sin categoría) */}
                {isLoggedIn && (
                  <button
                    onClick={() => {
                      setProductoEdit(null);
                      setDefaultCategoriaId(
                        selected === "general" ? undefined : (selected as number)
                      ); // 👉 preselecciona la categoría activa
                      setShowCreateModal(true);
                    }}
                    className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-xs font-semibold hover:bg-neutral-50"
                  >
                    + Crear
                  </button>
                )}
              </div>
            </header>

            {/* Listado con altura ACOTADA y scroll si hace falta */}
            <div className="px-5 pb-5">
              <div className="max-h-[70vh] overflow-y-auto">
                {loading ? (
                  <p className="text-sm text-neutral-500">Cargando…</p>
                ) : (
                  <ProductoList
                    productos={productosFiltrados}
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
                            })
                        : undefined
                    }
                    onDelete={isLoggedIn ? handleDelete : undefined}
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL: Crear/Editar producto */}
      {(showCreateModal || productoEdit) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => {
            setShowCreateModal(false);
            setProductoEdit(null);
            setDefaultCategoriaId(undefined);
          }}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-4">
              <h3 className="text-lg font-semibold text-neutral-800">
                {productoEdit ? "Editar producto" : "Nuevo producto"}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setProductoEdit(null);
                  setDefaultCategoriaId(undefined);
                }}
                className="rounded-md border border-neutral-200 px-2 py-1 text-sm hover:bg-neutral-50"
                aria-label="Cerrar"
              >
                ✕
              </button>
            </div>
            <div className="p-5">
              <ProductoForm
                onSave={handleSave}
                productoEdit={productoEdit}
                onCancel={() => {
                  setShowCreateModal(false);
                  setProductoEdit(null);
                  setDefaultCategoriaId(undefined);
                }}
                categorias={categorias}
                // 👇 nueva prop para prefijar categoría en creación
                defaultCategoriaId={defaultCategoriaId}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
