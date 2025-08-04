import { FaCreditCard, FaMoneyBillWave } from "react-icons/fa";

type TotalesProps = {
  input: string;
  totalVenta: number;
  pagar: (metodo: "efectivo" | "tarjeta") => void;
};

export default function Totales({ input, totalVenta, pagar }: TotalesProps) {
  return (
    <div className="totales">
      <input type="text" value={input || totalVenta.toFixed(2)} readOnly />
      <button onClick={() => pagar("efectivo")} className="efectivo">
        <FaMoneyBillWave style={{ marginRight: "6px" }} /> efectivo
      </button>
      <button onClick={() => pagar("tarjeta")} className="tarjeta">
        <FaCreditCard style={{ marginRight: "6px" }} /> tarjeta
      </button>
    </div>
  );
}
