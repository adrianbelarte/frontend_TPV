import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";
import { api } from "../config/api";  // <-- Importa tu helper api()
import "../pages/Home/HomePage.css"

export default function HomePOS() {
  const [categorias, setCategorias] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState([]);
  const [venta, setVenta] = useState([]);
  const [seleccion, setSeleccion] = useState([]);

  useEffect(() => {
    // Carga categorías y productos sin categoría al inicio
    authFetch(api("/api/categorias"))
      .then(setCategorias);
    fetchProductosSinCategoria();
  }, []);

  // Función para cargar productos sin categoría
  const fetchProductosSinCategoria = async () => {
    try {
      const allProductos = await authFetch(api("/api/productos"));
      const sinCategoria = allProductos.filter(p => !p.categoriaId);
      setProductosVisibles(sinCategoria);
    } catch (err) {
      alert("Error cargando productos sin categoría: " + err.message);
    }
  };

  // Función para filtrar productos según categoría o sin categoría si catId es null
  const filtrarCategoria = async (catId) => {
    if (catId === null) {
      // Mostrar productos sin categoría
      fetchProductosSinCategoria();
      return;
    }

    try {
      const data = await authFetch(api(`/api/categorias/${catId}/productos`));
      setProductosVisibles(data);
    } catch (err) {
      alert("Error cargando productos de la categoría: " + err.message);
    }
  };

  const agregarProd = (prod) => {
    setVenta(prev => {
      const ex = prev.find(i => i.producto.id === prod.id);
      if (ex) return prev.map(i => i.producto.id === prod.id
        ? { ...i, cantidad: i.cantidad + 1 }
        : i);
      return [...prev, { producto: prod, cantidad: 1 }];
    });
  };

  const eliminarProd = prodId => {
    setVenta(prev => {
      const ex = prev.find(i => i.producto.id === prodId);
      if (!ex) return prev;
      if (ex.cantidad > 1) {
        return prev.map(i => i.producto.id === prodId
          ? { ...i, cantidad: i.cantidad - 1 } : i);
      }
      return prev.filter(i => i.producto.id !== prodId);
    });
  };

  const toggleSelect = prodId => {
    setSeleccion(prev => prev.includes(prodId)
      ? prev.filter(id => id !== prodId) : [...prev, prodId]);
  };

  const pagar = tipo =>
    authFetch(api("/api/tickets"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo_pago: tipo,
        fecha: new Date(),
        total: venta.reduce((s, i) => s + i.cantidad * i.producto.precio, 0),
        productos: venta.map(i => ({ productoId: i.producto.id, cantidad: i.cantidad }))
      })
    })
    .then(() => setVenta([]))
    .catch(e => alert(e.message));

  return (
    <div className="homepos-container">
      <div className="categorias-section">
        {categorias.map(c =>
          <div key={c.id} className="categoria-card"
               onClick={() => filtrarCategoria(c.id)}>
            {c.imagen
              ? <img src={c.imagen} alt={c.nombre} />
              : <span>{c.nombre}</span>}
          </div>
        )}
        <div className="categoria-card" onClick={() => filtrarCategoria(null)}>
          Sin categoría
        </div>
      </div>

      <div className="main-layout">
        <div className="venta-actual">
          <h2>Venta actual</h2>
          <ul>
            {venta.map(item => (
              <li key={item.producto.id}
                  className={seleccion.includes(item.producto.id) ? "seleccionado" : ""}
                  onClick={() => toggleSelect(item.producto.id)}>
                <span>{item.producto.nombre} x {item.cantidad} = {(item.producto.precio * item.cantidad).toFixed(2)} €</span>
                <button onClick={e => { e.stopPropagation(); eliminarProd(item.producto.id); }}>✖️</button>
              </li>
            ))}
          </ul>
          {venta.length > 0 &&
            <div className="botones-pago">
              <button onClick={() => pagar("efectivo")}>
                <div className="icono">💶</div>
                <div className="texto">Pago en efectivo</div>
              </button>
              <button onClick={() => pagar("tarjeta")}>
                <div className="icono">💳</div>
                <div className="texto">Pago con tarjeta</div>
              </button>
            </div>
          }
        </div>

        <div className="productos-visibles">
          {productosVisibles.map(p => (
            <div key={p.id} className="producto-card" onClick={() => agregarProd(p)}>
              <strong>{p.nombre}</strong>
              <div>{p.precio} €</div>
              {p.imagen
                ? <img src={p.imagen} alt={p.nombre} />
                : <div className="placeholder">{p.nombre}</div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
