import type { Producto } from "../../types/producto";

type ProductoGridProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export default function ProductoGrid({ productos, onAgregar }: ProductoGridProps) {
  return (
    <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 max-h-[700px] scrollbar-thin">
      {productos.map((p) => (
        <div
          key={p.id}
          className="min-w-[130px] max-w-[140px] select-none bg-lime-50 border border-lime-200 rounded-xl px-4 py-3 flex flex-col items-center gap-2 shadow hover:shadow-md transition-shadow hover:bg-lime-100 cursor-pointer"
          onClick={() => onAgregar(p)}
          title={p.nombre}
        >
          <div className="font-bold text-base text-lime-900 text-center truncate w-full">{p.nombre}</div>

          <div className="w-14 h-14">
            {p.imagen ? (
              <img
                src={p.imagen}
                alt={p.nombre}
                className="w-14 h-14 object-contain rounded-md shadow-sm"
              />
            ) : (
              <div className="w-full h-full grid place-items-center text-xs text-slate-400 italic">
                Sin imagen
              </div>
            )}
          </div>

          <div className="font-extrabold text-lg text-lime-700">
            {Number(p.precio).toFixed(2)}€
          </div>
        </div>
      ))}
    </div>
  );
}
