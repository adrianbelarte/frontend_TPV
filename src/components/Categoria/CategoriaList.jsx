export default function CategoriaList({ categorias, onEdit, onDelete }) {
  return (
    <ul>
      {categorias.map((cat) => (
        <li key={cat.id} style={{ marginBottom: '1rem' }}>
          <div>
            {cat.imagen && (
              <img
                src={cat.imagen} // aquí directamente la URL que viene
                alt={cat.nombre}
                style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 10 }}
              />
            )}
            <strong>{cat.nombre}</strong>
          </div>
          {onEdit && <button onClick={() => onEdit(cat)}>Editar</button>}
          {onDelete && <button onClick={() => onDelete(cat.id)}>Eliminar</button>}
        </li>
      ))}
    </ul>
  );
}
