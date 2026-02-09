import { useState, useEffect } from "react";
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
    if (categoriaEdit?.id) {
      setNombre(categoriaEdit.nombre || "");
      setUrlImagen(categoriaEdit.imagen || "");
      setFile(null);
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
    formData.append("nombre", nombre.trim());
    if (file) formData.append("imagen", file);
    else if (urlImagen.trim()) formData.append("imagen", urlImagen.trim());
    await onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">Nombre</label>
        <input
          type="text"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre de categoría"
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">URL de imagen</label>
          <input
            type="url"
            value={urlImagen}
            onChange={(e) => {
              setUrlImagen(e.target.value);
              if (e.target.value) setFile(null); // si pones URL, anulamos archivo
            }}
            placeholder="https://imagen.jpg"
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Subir imagen</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) setUrlImagen(""); // si subes archivo, anulamos URL
            }}
            className="mt-1 w-full text-sm text-neutral-600 file:mr-3 file:rounded-md file:border-0 file:bg-sky-600 file:px-3 file:py-2 file:text-white hover:file:bg-sky-700"
          />
        </div>
      </div>

      {(urlImagen && !file) && (
        <img
          src={urlImagen}
          alt="Vista previa"
          className="mt-2 h-24 w-auto rounded-lg border border-neutral-200 object-contain"
        />
      )}

      <div className="flex gap-3 pt-1">
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white hover:bg-sky-700"
        >
          {categoriaEdit?.id ? "Actualizar" : "Crear"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 hover:bg-neutral-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
