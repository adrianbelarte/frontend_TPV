import type { Categoria } from "../../types/categoria";

type CategoriaSelectorProps = {
  categorias: Categoria[];
  filtrarCategoria: (id: number | string | null) => void;
};

export default function CategoriaSelector({ categorias, filtrarCategoria }: CategoriaSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-5">
      <button
        onClick={() => filtrarCategoria(null)}
        className="w-[90px] py-3 text-center rounded-xl border border-dashed border-slate-300 bg-slate-50 hover:bg-slate-100 text-slate-500 font-semibold shadow-sm transition-colors"
        title="Sin categoría"
      >
        Sin categoría
      </button>

      {categorias.map((c) => (
        <button
          key={c.id}
          onClick={() => filtrarCategoria(c.id)}
          className="w-[90px] py-3 text-center rounded-xl border border-slate-300 bg-slate-50 hover:bg-teal-50 hover:border-teal-600 hover:text-teal-800 text-slate-700 font-semibold shadow-sm transition-colors flex flex-col items-center gap-2"
          title={c.nombre}
        >
          {c.imagen ? (
            <img
              src={c.imagen}
              alt={c.nombre}
              className="w-[50px] h-[50px] object-contain rounded-md shadow-sm"
            />
          ) : null}
          <span className="truncate px-1">{c.nombre}</span>
        </button>
      ))}
    </div>
  );
}
