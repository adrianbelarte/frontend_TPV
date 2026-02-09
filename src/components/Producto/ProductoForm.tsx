import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ProductoInput } from "../../types/producto";
import type { Categoria } from "../../types/categoria";

type Props = {
  onSave: (producto: ProductoInput) => void;
  onCancel: () => void;
  productoEdit: ProductoInput | null;
  categorias: Categoria[];
  defaultCategoriaId?: number; // 👈 NUEVO
};

export default function ProductoForm({
  onSave,
  productoEdit,
  onCancel,
  categorias,
  defaultCategoriaId, // 👈 ¡ahora sí lo recogemos!
}: Props) {
  const [producto, setProducto] = useState<ProductoInput>({
    nombre: "",
    precio: 0,
    imagen: "",
    categoriaId: undefined,
  });

  useEffect(() => {
    if (productoEdit) {
      setProducto({
        id: productoEdit.id,
        nombre: productoEdit.nombre,
        precio: productoEdit.precio,
        imagen: productoEdit.imagen ?? "",
        categoriaId: productoEdit.categoriaId,
      });
    } else {
      setProducto({
        nombre: "",
        precio: 0,
        imagen: "",
        categoriaId: defaultCategoriaId ?? undefined, // 👈 usa la categoría por defecto si llega
      });
    }
  }, [productoEdit, defaultCategoriaId]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]:
        name === "precio"
          ? (value === "" ? 0 : Number.isNaN(parseFloat(value)) ? 0 : parseFloat(value))
          : name === "categoriaId"
          ? value === "" ? undefined : Number(value)
          : value,
    }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(producto);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          required
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          placeholder="Ej. Café solo"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-neutral-700">Precio (€)</label>
          <input
            type="number"
            step="0.01"
            name="precio"
            value={Number.isFinite(producto.precio) ? producto.precio : 0}
            onChange={handleChange}
            required
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
            placeholder="0.00"
            min={0}
            inputMode="decimal"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-700">Categoría</label>
          <select
            name="categoriaId"
            value={producto.categoriaId?.toString() ?? ""}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          >
            <option value="">-- Sin categoría --</option>
            {categorias.map((cat) => (
              <option key={cat.id} value={cat.id.toString()}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700">Imagen (URL)</label>
        <input
          type="url"
          name="imagen"
          value={producto.imagen ?? ""}
          onChange={handleChange}
          className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-sky-500"
          placeholder="https://..."
        />
        {producto.imagen ? (
          <div className="mt-2 flex items-center gap-3">
            <img
              src={producto.imagen}
              alt="preview"
              className="h-12 w-12 rounded-md object-contain ring-1 ring-neutral-200"
              onError={(e) => ((e.currentTarget.style.display = "none"))}
            />
            <span className="text-xs text-neutral-500">Vista previa</span>
          </div>
        ) : null}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <button
          type="submit"
          className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-sky-700 active:bg-sky-800"
        >
          {productoEdit?.id ? "Actualizar" : "Crear"}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-300 active:bg-neutral-400"
        >
          Cancelar
        </button>
      </div>
    </form>
  );
}
