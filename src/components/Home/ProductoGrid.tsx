import type { Producto } from "../../types/producto"; 


type ProductoGridProps = {
  productos: Producto[];
  onAgregar: (producto: Producto) => void;
};

export default function ProductoGrid({ productos, onAgregar }: ProductoGridProps) {
  return (
    <div className="items">
      {productos.map((p) => (
        <div
          key={p.id}
          className="item"
          onClick={() => onAgregar(p)}
          style={{ cursor: "pointer" }}
        >
          <div className="nombre">{p.nombre}</div>
          <div className="img">
            {p.imagen ? (
              <img src={p.imagen} alt={p.nombre} style={{ width: "50px" }} />
            ) : (
              "Sin imagen"
            )}
          </div>
          <div className="precio">{p.precio.toFixed(2)}€</div>
        </div>
      ))}
    </div>
  );
}
