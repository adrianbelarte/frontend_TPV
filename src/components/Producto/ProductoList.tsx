import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";

type Props = {
  productos: Producto[];
  categorias: Categoria[];
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
  onProductoClick?: (producto: Producto) => void | Promise<void>;
};

export default function ProductoList({
  productos,
  categorias,
  onEdit,
  onDelete,
  onProductoClick,
}: Props) {
  if (!productos.length)
    return (
      <p className="py-8 text-center text-sm text-neutral-500">
        No hay productos disponibles.
      </p>
    );

  const getCategoriaNombre = (id?: number) =>
    categorias.find((cat) => cat.id === id)?.nombre || "Sin categoría";

  return (
    <ul className="space-y-3">
      {productos.map((prod) => (
        <li
          key={prod.id}
          onClick={() => onProductoClick?.(prod)}
          className={`flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:shadow-md ${
            onProductoClick ? "cursor-pointer hover:bg-neutral-50" : ""
          }`}
        >
          {/* INFO */}
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {prod.imagen && (
              <img
                src={prod.imagen}
                alt={prod.nombre}
                className="h-14 w-14 flex-shrink-0 rounded-lg border border-neutral-200 object-cover"
              />
            )}
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-neutral-800">{prod.nombre}</p>
              <p className="text-sm text-neutral-500">{getCategoriaNombre(prod.categoriaId)}</p>
            </div>
          </div>

          {/* PRECIO */}
          <div className="whitespace-nowrap text-right font-medium text-sky-700">
            {prod.precio.toFixed(2)} €
          </div>

          {/* ACCIONES */}
          {(onEdit || onDelete) && (
            <div className="flex flex-shrink-0 gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(prod);
                  }}
                  className="rounded-md bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-amber-600 active:bg-amber-700"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(prod.id);
                  }}
                  className="rounded-md bg-rose-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-rose-700 active:bg-rose-800"
                >
                  Eliminar
                </button>
              )}
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
