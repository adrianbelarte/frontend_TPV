import type { Categoria } from "../../types/categoria";

interface Props {
  categorias: Categoria[];
  onEdit?: (categoria: Categoria) => void;
  onDelete?: (id: number) => void;
  onClick?: (categoria: Categoria) => void;
}

export default function CategoriaList({ categorias, onEdit, onDelete, onClick }: Props) {
  if (!categorias.length)
    return (
      <p className="py-3 text-center text-sm text-neutral-500">
        No hay categorías disponibles.
      </p>
    );

  return (
    <ul className="space-y-3">
      {categorias.map((cat) => (
        <li
          key={cat.id}
          onClick={() => onClick?.(cat)}
          className="flex items-center justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-3 shadow-sm transition hover:bg-neutral-50 hover:shadow-md cursor-pointer"
        >
          {/* IZQ: imagen + nombre */}
          <div className="flex min-w-0 flex-1 items-center gap-4">
            {cat.imagen && (
              <img
                src={cat.imagen}
                alt={cat.nombre}
                className="h-14 w-14 flex-shrink-0 rounded-lg border border-neutral-200 object-cover"
              />
            )}
            <strong className="truncate text-neutral-800">{cat.nombre}</strong>
          </div>

          {/* DER: acciones (no se mezclan con la imagen) */}
          {(onEdit || onDelete) && (
            <div className="flex flex-shrink-0 gap-2">
              {onEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(cat);
                  }}
                  className="rounded-md bg-amber-500 px-3 py-1 text-xs font-semibold text-white hover:bg-amber-600"
                >
                  Editar
                </button>
              )}
              {onDelete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(cat.id);
                  }}
                  className="rounded-md bg-rose-600 px-3 py-1 text-xs font-semibold text-white hover:bg-rose-700"
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
