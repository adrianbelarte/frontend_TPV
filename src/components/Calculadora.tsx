import { useState, type FC } from "react";

interface CalculadoraProps {
  total: number;
  onConfirmar: (efectivoRecibido: number, cambio: number) => void;
  onCancelar: () => void;
}

const Calculadora: FC<CalculadoraProps> = ({ total, onConfirmar, onCancelar }) => {
  const [efectivoRecibido, setEfectivoRecibido] = useState<string>("");
  const [display, setDisplay] = useState<string>("0");

  const calcularCambio = (): number => {
    const efectivo = parseFloat(efectivoRecibido || "0");
    return efectivo - total;
  };

  const cambio = calcularCambio();

  const handleNumero = (num: string) => {
    if (display === "0") {
      setDisplay(num);
      setEfectivoRecibido(num);
    } else {
      const nuevo = display + num;
      setDisplay(nuevo);
      setEfectivoRecibido(nuevo);
    }
  };

  const handleDecimal = () => {
    if (!display.includes(".")) {
      const nuevo = display + ".";
      setDisplay(nuevo);
      setEfectivoRecibido(nuevo);
    }
  };

  const handleBorrar = () => {
    if (display.length === 1) {
      setDisplay("0");
      setEfectivoRecibido("0");
    } else {
      const nuevo = display.slice(0, -1);
      setDisplay(nuevo);
      setEfectivoRecibido(nuevo);
    }
  };

  const handleLimpiar = () => {
    setDisplay("0");
    setEfectivoRecibido("0");
  };

  const botonesRapidos = [5, 10, 20, 50, 100];

  const handleBotonRapido = (valor: number) => {
    setDisplay(valor.toString());
    setEfectivoRecibido(valor.toString());
  };

  const handleConfirmar = () => {
    const efectivo = parseFloat(efectivoRecibido || "0");
    if (efectivo < total) {
      alert("El efectivo recibido es insuficiente");
      return;
    }
    onConfirmar(efectivo, cambio);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl">
        <div className="border-b border-neutral-200 bg-gradient-to-r from-sky-600 to-sky-700 px-6 py-4 rounded-t-2xl">
          <h2 className="text-xl font-bold text-white">Calculadora de Cobro</h2>
        </div>

        <div className="p-6 space-y-4">
          {/* Total a pagar */}
          <div className="bg-neutral-100 rounded-lg p-4">
            <p className="text-sm text-neutral-600 mb-1">Total a pagar:</p>
            <p className="text-3xl font-bold text-neutral-800">{total.toFixed(2)} €</p>
          </div>

          {/* Display efectivo recibido */}
          <div className="bg-sky-50 border-2 border-sky-200 rounded-lg p-4">
            <p className="text-sm text-sky-700 mb-1">Efectivo recibido:</p>
            <p className="text-4xl font-bold text-sky-900 text-right">{display} €</p>
          </div>

          {/* Cambio a devolver */}
          <div className={`rounded-lg p-4 ${cambio >= 0 ? 'bg-green-50 border-2 border-green-200' : 'bg-red-50 border-2 border-red-200'}`}>
            <p className="text-sm mb-1 font-medium" style={{ color: cambio >= 0 ? '#15803d' : '#dc2626' }}>
              Cambio a devolver:
            </p>
            <p className="text-3xl font-bold text-right" style={{ color: cambio >= 0 ? '#15803d' : '#dc2626' }}>
              {cambio >= 0 ? cambio.toFixed(2) : "INSUFICIENTE"} {cambio >= 0 && "€"}
            </p>
          </div>

          {/* Botones rápidos */}
          <div className="grid grid-cols-5 gap-2">
            {botonesRapidos.map((valor) => (
              <button
                key={valor}
                onClick={() => handleBotonRapido(valor)}
                className="bg-amber-500 hover:bg-amber-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
              >
                {valor}€
              </button>
            ))}
          </div>

          {/* Calculadora numérica */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumero(num.toString())}
                className="bg-neutral-200 hover:bg-neutral-300 font-bold text-xl py-4 rounded-lg transition-colors shadow-sm"
              >
                {num}
              </button>
            ))}

            <button
              onClick={handleDecimal}
              className="bg-neutral-200 hover:bg-neutral-300 font-bold text-xl py-4 rounded-lg transition-colors shadow-sm"
            >
              .
            </button>
            <button
              onClick={() => handleNumero("0")}
              className="bg-neutral-200 hover:bg-neutral-300 font-bold text-xl py-4 rounded-lg transition-colors shadow-sm"
            >
              0
            </button>
            <button
              onClick={handleBorrar}
              className="bg-red-500 hover:bg-red-600 text-white font-bold text-lg py-4 rounded-lg transition-colors shadow-sm"
            >
              ⌫
            </button>
          </div>

          {/* Botón limpiar */}
          <button
            onClick={handleLimpiar}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-lg transition-colors shadow-sm"
          >
            Limpiar (C)
          </button>

          {/* Botones de acción */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={onCancelar}
              className="bg-neutral-400 hover:bg-neutral-500 text-white font-bold py-4 rounded-lg transition-colors shadow-sm"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirmar}
              disabled={cambio < 0}
              className={`font-bold py-4 rounded-lg transition-colors shadow-sm ${
                cambio >= 0
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
              }`}
            >
              Confirmar y Abrir Cajón
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Calculadora;
