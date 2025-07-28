import "./ProductoList.css";


export default function ProductoList({ productos, onEdit, onDelete }) {
  if (!productos.length) return <p>No hay productos.</p>;

  return (
    <ul className="producto-list">
  {productos.map((prod) => (
    <li key={prod.id}>
      <div className="info">
        <strong>{prod.nombre}</strong> - ${prod.precio.toFixed(2)}
        {prod.categoria && <em> ({prod.categoria.nombre})</em>}
        {prod.imagen && <img src={prod.imagen} alt={prod.nombre} />}
      </div>
      <div className="actions">
        {onEdit && <button onClick={() => onEdit(prod)}>Editar</button>}
        {onDelete && <button onClick={() => onDelete(prod.id)}>Eliminar</button>}
      </div>
    </li>
  ))}
</ul>

  );
}
