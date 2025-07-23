export default function ProductoList({ productos, onEdit, onDelete }) {
  if (!productos.length) return <p>No hay productos.</p>;

  return (
    <ul>
      {productos.map((prod) => (
        <li key={prod.id}>
          <strong>{prod.nombre}</strong> - ${prod.precio.toFixed(2)}
          {prod.categoria && <em> ({prod.categoria.nombre})</em>}
          {prod.imagen && <img src={prod.imagen} alt={prod.nombre} style={{width: 50, marginLeft: 10}} />}
          {onEdit && <button onClick={() => onEdit(prod)}>Editar</button>}
          {onDelete && <button onClick={() => onDelete(prod.id)}>Eliminar</button>}
        </li>
      ))}
    </ul>
  );
}
