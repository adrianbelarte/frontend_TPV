import { useState, useEffect } from "react";
import "./EmpresaForm.css";

export default function EmpresaForm({ empresaEdit, onSave, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [telefono, setTelefono] = useState("");
  const [correo, setCorreo] = useState("");
  const [cif, setCif] = useState("");

  useEffect(() => {
    if (empresaEdit) {
      setNombre(empresaEdit.nombre || "");
      setDireccion(empresaEdit.direccion || "");
      setTelefono(empresaEdit.telefono || "");
      setCorreo(empresaEdit.correo || "");
      setCif(empresaEdit.cif || "");
    } else {
      setNombre("");
      setDireccion("");
      setTelefono("");
      setCorreo("");
      setCif("");
    }
  }, [empresaEdit]);

  function handleSubmit(e) {
    e.preventDefault();
    onSave({ nombre, direccion, telefono, correo, cif });
  }

  return (
    <form onSubmit={handleSubmit} className="empresa-form">
      <input
        type="text"
        placeholder="Nombre"
        value={nombre}
        onChange={e => setNombre(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Dirección"
        value={direccion}
        onChange={e => setDireccion(e.target.value)}
      />
      <input
        type="tel"
        placeholder="Teléfono"
        value={telefono}
        onChange={e => setTelefono(e.target.value)}
      />
      <input
        type="email"
        placeholder="Correo"
        value={correo}
        onChange={e => setCorreo(e.target.value)}
      />
      <input
        type="text"
        placeholder="CIF"
        value={cif}
        onChange={e => setCif(e.target.value)}
      />
      <button type="submit">Guardar</button>
      <button type="button" onClick={onCancel}>Cancelar</button>
    </form>
  );
}
