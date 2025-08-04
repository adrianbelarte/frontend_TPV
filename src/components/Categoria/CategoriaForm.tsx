import { useState, useEffect } from "react";
import './CategoriaForm.css';
import type { CategoriaInput } from "../../types/categoria";

interface Props {
  onSave: (formData: FormData) => Promise<void>;
  categoriaEdit: CategoriaInput | null;
  onCancel: () => void;
}

export default function CategoriaForm({ onSave, categoriaEdit, onCancel }: Props) {
  const [nombre, setNombre] = useState("");
  const [urlImagen, setUrlImagen] = useState("");
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (categoriaEdit) {
      setNombre(categoriaEdit.nombre || "");
      setUrlImagen(categoriaEdit.imagen || "");
      setFile(null); // limpiar archivo al editar
    } else {
      setNombre("");
      setUrlImagen("");
      setFile(null);
    }
  }, [categoriaEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    if (categoriaEdit?.id) formData.append("id", String(categoriaEdit.id));
    formData.append("nombre", nombre);
    
    if (file) {
      formData.append("imagen", file);
    } else if (urlImagen.trim()) {
      formData.append("imagen", urlImagen.trim());
    }

    await onSave(formData);
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
          placeholder="URL de imagen (opcional)"
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />

        {urlImagen && !file && (
          <img
            src={urlImagen}
            alt="Vista previa"
            style={{ maxWidth: "200px", marginTop: "10px" }}
          />
        )}

        <button type="submit">{categoriaEdit ? "Actualizar" : "Crear"}</button>
        {categoriaEdit && (
          <button type="button" onClick={onCancel}>Cancelar</button>
        )}
      </form>
    </div>
  );
}
