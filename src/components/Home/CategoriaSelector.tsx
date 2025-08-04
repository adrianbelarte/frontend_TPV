import type { Categoria } from "../../types/categoria"; 

type CategoriaSelectorProps = {
  categorias: Categoria[];
  filtrarCategoria: (id: number | string | null) => void;
};

export default function CategoriaSelector({ categorias, filtrarCategoria }: CategoriaSelectorProps) {
  return (
    <div className="categorias">
      <button
        onClick={() => filtrarCategoria(null)}
        className="categoria sin-imagen"
        title="Sin categoría"
      >
        Sin categoría
      </button>
      {categorias.map((c) => (
        <button
          key={c.id}
          onClick={() => filtrarCategoria(c.id)}
          className="categoria"
          title={c.nombre}
        >
          {c.imagen ? <img src={c.imagen} alt={c.nombre} /> : null}
          <span>{c.nombre}</span>
        </button>
      ))}
    </div>
  );
}
