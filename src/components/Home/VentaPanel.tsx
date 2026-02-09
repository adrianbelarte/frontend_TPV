import { FaTimes } from "react-icons/fa";
import type { VentaItem } from "../../types/venta";

interface VentaPanelProps {
  venta: VentaItem[];
  eliminarProd: (prodId: number) => void;
}

export default function VentaPanel({ venta, eliminarProd }: VentaPanelProps) {
  return (
    <div className="flex-1 overflow-y-auto p-3 bg-slate-50 rounded-md border border-slate-200 shadow-inner">
      {venta.length === 0 && (
        <div className="text-slate-500">No hay productos en la venta</div>
      )}

      {venta.map((item) => (
        <div
          key={item.producto.id}
          className="flex items-center justify-between gap-2 mb-2 px-3 py-2 bg-white rounded-md border border-slate-200 hover:bg-sky-50 transition-colors"
          title={item.producto.nombre}
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-slate-800 truncate">
              {item.producto.nombre}
            </div>
            <div className="text-sm text-slate-500">
              {(Number(item.producto.precio) * Number(item.cantidad)).toFixed(2)}€
            </div>
          </div>

          <div className="min-w-[40px] text-center font-bold text-slate-700">
            x{item.cantidad}
          </div>

          <button
            onClick={() => eliminarProd(item.producto.id)}
            title="Eliminar producto"
            className="p-2 text-red-500 hover:text-red-600 active:scale-95 transition"
          >
            <FaTimes />
          </button>
        </div>
      ))}
    </div>
  );
}
