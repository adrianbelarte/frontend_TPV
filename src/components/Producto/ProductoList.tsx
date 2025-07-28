import "./ProductoList.css";

import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";

type Props = {
  productos: Producto[];
  categorias: Categoria[];  // Añadimos esta prop para resolver el nombre de la categoría
  onEdit?: (producto: Producto) => void;
  onDelete?: (id: number) => void;
  onProductoClick?: (producto: Producto) => void | Promise<void>;
};

export default function ProductoList({ productos, categorias, onEdit, onDelete, onProductoClick }: Props) {
  if (!productos.length) return <p>No hay productos.</p>;

  // Buscar el nombre de la categoría por id
  const getCategoriaNombre = (id?: number) => {
    return categorias.find((cat) => cat.id === id)?.nombre || "Sin categoría";
  };

  return (
    <ul className="producto-list">
      {productos.map((prod) => (
        <li
          key={prod.id}
          onClick={() => onProductoClick?.(prod)}
          style={{ cursor: onProductoClick ? "pointer" : "default" }}
        >
          <div className="info">
            <strong>{prod.nombre}</strong> - ${prod.precio.toFixed(2)}{" "}
            <em>({getCategoriaNombre(prod.categoriaId)})</em>
            {/* Si quieres mostrar imagen, asegúrate que Producto tenga esta propiedad */}
            {prod.imagen && <img src={prod.imagen} alt={prod.nombre} />}
          </div>
          <div className="actions">
            {onEdit && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(prod);
                }}
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(prod.id);
                }}
              >
                Eliminar
              </button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
