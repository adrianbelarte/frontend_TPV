import { useState, useEffect } from "react";

export default function ProductoForm({ onSave, productoEdit, onCancel, categorias, productosExtras }) {
  const [producto, setProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    categoriaId: "",
    extras: [], // array de ids de productos extra
  });

  useEffect(() => {
    if (productoEdit) {
      // para extras puede ser un array de objetos, extraemos ids
      const extrasIds = productoEdit.extras ? productoEdit.extras.map(e => e.id) : [];
      setProducto({ ...productoEdit, categoriaId: productoEdit.categoriaId || "", extras: extrasIds });
    } else {
      setProducto({ nombre: "", precio: "", imagen: "", categoriaId: "", extras: [] });
    }
  }, [productoEdit]);

  function handleChange(e) {
    const { name, value } = e.target;
    setProducto((prev) => ({ ...prev, [name]: value }));
  }

  function handleExtrasChange(e) {
    const options = e.target.options;
    const selectedExtras = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selectedExtras.push(Number(options[i].value));
    }
    setProducto((prev) => ({ ...prev, extras: selectedExtras }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const parsedProducto = {
      ...producto,
      precio: parseFloat(producto.precio),
      categoriaId: producto.categoriaId ? Number(producto.categoriaId) : null,
    };
    onSave(parsedProducto);
  }

  return (
    <form onSubmit={handleSubmit}>
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
        <select name="categoriaId" value={producto.categoriaId} onChange={handleChange}>
          <option value="">-- Sin categoría --</option>
          {categorias.map(cat => (
            <option key={cat.id} value={cat.id}>{cat.nombre}</option>
          ))}
        </select>
      </label>

      <label>
        Productos Extras (Ctrl+click para seleccionar varios):
        <select multiple size={5} value={producto.extras} onChange={handleExtrasChange}>
          {productosExtras.map(prod => (
            <option key={prod.id} value={prod.id}>{prod.nombre}</option>
          ))}
        </select>
      </label>

      <button type="submit">{productoEdit ? "Actualizar" : "Crear"}</button>
      {productoEdit && <button type="button" onClick={onCancel}>Cancelar</button>}
    </form>
  );
}
