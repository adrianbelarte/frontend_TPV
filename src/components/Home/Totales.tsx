import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

type TotalesProps = {
  input: string;
  totalVenta: number;
  pagar: (metodo: "efectivo" | "tarjeta") => void;
};

export default function Totales({ input, totalVenta, pagar }: TotalesProps) {
  return (
    <div className="grid grid-cols-2 gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 shadow-inner">
      <input
        type="text"
        value={input || totalVenta.toFixed(2)}
        readOnly
        className="col-span-2 px-4 py-3 text-right text-xl font-bold rounded-lg border border-slate-300 bg-white select-text"
      />

      <button
        onClick={() => pagar("efectivo")}
        className="flex items-center justify-center gap-2 py-3 rounded-lg text-white font-bold shadow hover:brightness-95 active:brightness-90 transition-all bg-green-600"
      >
        <FaMoneyBillWave className="text-lg" />
        Efectivo
      </button>

      <button
        onClick={() => pagar("tarjeta")}
        className="flex items-center justify-center gap-2 py-3 rounded-lg text-white font-bold shadow hover:brightness-95 active:brightness-90 transition-all bg-blue-600"
      >
        <FaCreditCard className="text-lg" />
        Tarjeta
      </button>
    </div>
  );
}
