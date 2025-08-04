import "./ProductoForm.css";
import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";

import type { ProductoInput, ProductoExtra} from "../../types/producto";
import type { Categoria } from "../../types/categoria";

type Props = {
  onSave: (producto: ProductoInput) => void;
  onCancel: () => void;
  productoEdit: ProductoInput | null;
  categorias: Categoria[];
  productosExtras: ProductoExtra[];
};

export default function ProductoForm({
  onSave,
  productoEdit,
  onCancel,
  categorias,
  productosExtras,
}: Props) {
  const [producto, setProducto] = useState<ProductoInput>({
    nombre: "",
    precio: 0,
    imagen: "",
    categoriaId: undefined,
    extras: [],
  });

  useEffect(() => {
    if (productoEdit) {
      setProducto({
        id: productoEdit.id,
        nombre: productoEdit.nombre,
        precio: productoEdit.precio,
        imagen: productoEdit.imagen ?? "",
        categoriaId: productoEdit.categoriaId,
        extras: productoEdit.extras ?? [],
      });
    } else {
      setProducto({ nombre: "", precio: 0, imagen: "", categoriaId: undefined, extras: [] });
    }
  }, [productoEdit]);

  function handleChange(e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setProducto((prev) => ({
      ...prev,
      [name]:
        name === "precio"
          ? parseFloat(value)
          : name === "categoriaId"
          ? value === "" ? undefined : Number(value)
          : value,
    }));
  }

  function handleExtrasChange(e: ChangeEvent<HTMLSelectElement>) {
    const options = e.target.options;
    const selectedExtras: number[] = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedExtras.push(Number(options[i].value));
    }
    setProducto((prev) => ({ ...prev, extras: selectedExtras }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSave(producto);
  }

  return (
    <form className="producto-form" onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          name="nombre"
          value={producto.nombre}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Precio:
        <input
          type="number"
          step="0.01"
          name="precio"
          value={producto.precio}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Imagen URL:
        <input
          type="text"
          name="imagen"
          value={producto.imagen}
          onChange={handleChange}
        />
      </label>

      <label>
        Categoría:
        <select
          name="categoriaId"
          value={producto.categoriaId?.toString() ?? ""}
          onChange={handleChange}
        >
          <option value="">-- Sin categoría --</option>
          {categorias.map((cat) => (
            <option key={cat.id} value={cat.id.toString()}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </label>

      <label>
        Productos Extras:
        <select
          multiple
          size={5}
          value={producto.extras?.map(String) ?? []}
          onChange={handleExtrasChange}
        >
          {productosExtras.map((prod) => (
            <option key={prod.id} value={prod.id.toString()}>
              {prod.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="button-group">
  <button type="submit">{productoEdit ? "Actualizar" : "Crear"}</button>
  {productoEdit && (
    <button type="button" className="cancel-btn" onClick={onCancel}>
      Cancelar
    </button>
  )}
</div>
    </form>
  );
}
