// src/components/categoria/CategoriaList.jsx
export default function CategoriaList({ categorias, onEdit, onDelete, onClick }) {
  return (
    <ul>
      {categorias.map((cat) => (
        <li key={cat.id} onClick={() => onClick?.(cat)} style={{ cursor: "pointer" }}>
          <div>
            {cat.imagen && (
              <img
                src={cat.imagen}
                alt={cat.nombre}
                style={{ width: 100, height: 100, objectFit: 'cover', marginRight: 10 }}
              />
            )}
            <strong>{cat.nombre}</strong>
          </div>
          {onEdit && <button onClick={(e) => { e.stopPropagation(); onEdit(cat); }}>Editar</button>}
          {onDelete && <button onClick={(e) => { e.stopPropagation(); onDelete(cat.id); }}>Eliminar</button>}
        </li>
      ))}
    </ul>
  );
}
