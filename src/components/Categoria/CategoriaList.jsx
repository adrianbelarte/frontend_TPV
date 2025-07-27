import './CategoriaList.css';


export default function CategoriaList({ categorias, onEdit, onDelete, onClick }) {
  return (
    <div className="categoria-list">
      {categorias.map((cat) => (
        <div
          key={cat.id}
          className="categoria-item"
          onClick={() => onClick?.(cat)}
        >
          {cat.imagen && (
            <img
              src={cat.imagen}
              alt={cat.nombre}
            />
          )}
          <strong>{cat.nombre}</strong>
          {onEdit && (
            <button onClick={(e) => { e.stopPropagation(); onEdit(cat); }}>
              Editar
            </button>
          )}
          {onDelete && (
            <button onClick={(e) => { e.stopPropagation(); onDelete(cat.id); }}>
              Eliminar
            </button>
          )}
        </div>
      ))}
    </div>
  );
}

