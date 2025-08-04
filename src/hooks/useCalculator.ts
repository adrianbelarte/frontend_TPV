import { useState } from "react";

export function useCalculator(
  externalInput?: string,
  setExternalInput?: (val: string) => void
) {
  const [input, setInput] = useState(externalInput || "");
  const [total, setTotal] = useState<number | null>(null); // Guardamos total calculado
  const value = externalInput !== undefined ? externalInput : input;
  const setValue = setExternalInput || setInput;

  const addDigit = (d: string) => {
    setValue(value + d);
  };

  const addOperator = (op: string) => {
    if (value === "") return; 
    const lastChar = value[value.length - 1];
    if ("+-*/".includes(lastChar)) {
      setValue(value.slice(0, -1) + op);
    } else {
      setValue(value + op);
    }
  };

  // Función para limpiar todo (input y total)
  const clear = () => {
    setValue("");
    setTotal(null);
  };

  // Borrar último carácter
  const backspace = () => setValue(value.slice(0, -1));

  // Lógica para cuando seleccionan un producto con precio
  // Si el input termina en '*', multiplicamos el número previo por el precio
  const selectProduct = (price: number) => {
    if (value.endsWith("*")) {
      // Obtener número antes del *
      const parts = value.split("*");
      const numberPart = parts.slice(0, -1).join("*");
      const num = parseFloat(numberPart);
      if (!isNaN(num)) {
        const result = num * price;
        setValue(String(result));
        setTotal(result);
      }
    }
  };

  // Lógica para pagar efectivo y mostrar cambio
  // Si el input es solo un número (cantidad pagada) y total está definido
  const payCash = () => {
    const paidAmount = parseFloat(value);
    if (!isNaN(paidAmount) && total !== null) {
      const change = paidAmount - total;
      if (change >= 0) {
        alert(`Cambio a devolver: ${change.toFixed(2)}`);
        clear();
      } else {
        alert("Pago insuficiente");
      }
    } else {
      alert("Introduce una cantidad válida para pagar");
    }
  };

  // Método para dividir el total (ejemplo: se pulsó total y luego "/" y un número)
  const divideTotal = (divisor: number) => {
    if (total !== null && divisor !== 0) {
      const result = total / divisor;
      setValue(String(result));
      setTotal(result);
    }
  };

  return {
    input: value,
    addDigit,
    addOperator,
    clear,
    backspace,
    selectProduct,
    payCash,
    divideTotal,
    total,
  };
}
