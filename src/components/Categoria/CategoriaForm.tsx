import { useState, useEffect } from "react";
import './CategoriaForm.css';


export default function CategoriaForm({ onSave, categoriaEdit, onCancel }) {
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [urlImagen, setUrlImagen] = useState("");

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre || "");
      setDescripcion(categoriaEdit.descripcion || "");
      setUrlImagen(categoriaEdit.imagen || "");
    } else {
      setNombre("");
      setDescripcion("");
      setUrlImagen("");
    }
  }, [categoriaEdit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      id: categoriaEdit?.id,
      nombre,
      descripcion,
      imagen: urlImagen.trim(),
    });
  };

  return (
  <div className="categoria-form">
    <form onSubmit={handleSubmit}>
      <input
        name="nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        placeholder="Nombre de categoría"
        required
      />
      <input
        type="text"
        name="imagenUrl"
        value={urlImagen}
        onChange={(e) => setUrlImagen(e.target.value)}
        placeholder="URL de imagen"
      />
      <button type="submit">{categoriaEdit ? "Actualizar" : "Crear"}</button>
      {categoriaEdit && (
        <button type="button" onClick={onCancel}>Cancelar</button>
      )}
    </form>
  </div>
);
}
