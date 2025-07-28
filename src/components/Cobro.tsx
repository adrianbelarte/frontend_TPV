import React, { useState } from 'react';
import { imprimirTicket } from '../utils/imprimir';

export default function Cobro({ ticket, onCobrado }) {
  const [tipoPago, setTipoPago] = useState('efectivo'); // o 'tarjeta'

  const manejarCobro = async () => {
   try{
     await imprimirTicket(ticket, tipoPago);
     onCobrado();
   }catch(err){
    alert("Error al cobrar: " + err.message);
   }
  
  };

  return (
    <div>
      <h3>Forma de pago</h3>
      <select value={tipoPago} onChange={e => setTipoPago(e.target.value)}>
        <option value="efectivo">Efectivo</option>
        <option value="tarjeta">Tarjeta</option>
      </select>
      <button onClick={manejarCobro}>Cobrar</button>
    </div>
  );
}
