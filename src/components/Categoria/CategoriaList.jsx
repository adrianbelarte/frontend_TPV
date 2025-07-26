export default function CategoriaList({ categorias, onEdit, onDelete, onClick }) {
  return (
    <ul>
      {/* Opción Sin categoría */}
      <li 
        key="sin-categoria" 
        onClick={() => onClick?.(null)} 
        style={{ cursor: "pointer", marginBottom: "10px", fontWeight: "bold" }}
      >
        <div>
          <strong>Sin categoría</strong>
        </div>
      </li>

      {categorias.map((cat) => (
        <li key={cat.id} onClick={() => onClick?.(cat)} style={{ cursor: "pointer" }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
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
