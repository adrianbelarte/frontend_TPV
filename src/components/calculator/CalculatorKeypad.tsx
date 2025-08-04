type Props = {
  addDigit: (d: string) => void;
  clear: () => void;
  backspace: () => void;
  addOperator: (op: string) => void;
  // eliminamos calculate porque no usamos "="
};

export default function CalculatorKeypad({ addDigit, clear, addOperator }: Props) {
  const buttons = [
    { label: "1", action: () => addDigit("1") },
    { label: "2", action: () => addDigit("2") },
    { label: "3", action: () => addDigit("3") },
    { label: "/", action: () => addOperator("/") },
    { label: "4", action: () => addDigit("4") },
    { label: "5", action: () => addDigit("5") },
    { label: "6", action: () => addDigit("6") },
    { label: "*", action: () => addOperator("*") },
    { label: "7", action: () => addDigit("7") },
    { label: "8", action: () => addDigit("8") },
    { label: "9", action: () => addDigit("9") },
    { label: "+", action: () => addOperator("+") },
    { label: "←", action: clear },      // Si quieres, este lo podemos dejar como backspace (borrar último)
    { label: "0", action: () => addDigit("0") },
    { label: "C", action: clear },      // Nuevo botón para limpiar toda la calculadora
    { label: "-", action: () => addOperator("-") },
  ];

  return (
    <div className="calc-keypad">
      {buttons.map(({ label, action }) => (
        <button key={label} onClick={action}>{label}</button>
      ))}
    </div>
  );
}
