
import CalculatorKeypad from "./CalculatorKeypad";
import { useCalculator } from "../../hooks/useCalculator";
import "./Calculator.css";


export default function Calculator({ value, onChange }: { value: string, onChange: (val: string) => void }) {
  const calculator = useCalculator(value, onChange);

  return (
    <div className="calculator">
      <CalculatorKeypad {...calculator} />
    </div>
  );
}
