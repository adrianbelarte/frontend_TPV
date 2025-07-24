import { useEffect, useState } from "react";
import { authFetch } from "../utils/authFetch";

export default function HomePOS() {
  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [productosVisibles, setProductosVisibles] = useState([]); // según la categoría
  const [venta, setVenta] = useState([]); // [{ producto, cantidad }]
  const [ventaSeleccionada, setVentaSeleccionada] = useState([])

  useEffect(() => {
    fetchCategorias();
    fetchProductosSinCategoria();
  }, []);

  async function fetchCategorias() {
    const data = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/categorias`);
    setCategorias(data);
  }

  async function fetchProductosSinCategoria() {
    const data = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/productos`);
    const sinCategoria = data.filter((p) => !p.categoriaId);
    setProductosVisibles(sinCategoria);
  }

  async function handleCategoriaClick(cat) {
    const data = await authFetch(`${import.meta.env.VITE_BASE_URL}/api/categorias/${cat.id}/productos`);
    setProductosVisibles(data);
  }

  function handleProductoClick(prod) {
    setVenta((prev) => {
      const existente = prev.find((item) => item.producto.id === prod.id);
      if (existente) {
        return prev.map((item) =>
          item.producto.id === prod.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        return [...prev, { producto: prod, cantidad: 1 }];
      }
    });
  }

  

  function handlePagar(tipo_pago) {
    if (venta.length === 0) return alert("No hay productos en la venta");

    const total = venta.reduce((sum, item) => sum + item.producto.precio * item.cantidad, 0);

    const payload = {
      fecha: new Date(),
      tipo_pago,
      total,
      productos: venta.map((item) => ({
        productoId: item.producto.id,
        cantidad: item.cantidad,
      })),
    };

    authFetch(`${import.meta.env.VITE_BASE_URL}/api/tickets`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(() => {
        alert("Venta realizada con éxito");
        setVenta([]);
      })
      .catch((err) => {
        alert("Error al registrar la venta: " + err.message);
      });
  }

  function handleEliminarProducto(prodId) {
  setVenta((prev) => {
    const existente = prev.find((item) => item.producto.id === prodId);
    if (!existente) return prev;

    if (existente.cantidad > 1) {
      return prev.map((item) =>
        item.producto.id === prodId
          ? { ...item, cantidad: item.cantidad - 1 }
          : item
      );
    }

    // Si la cantidad es 1, lo quitamos de la lista
    return prev.filter((item) => item.producto.id !== prodId);
  });
}

function toggleSeleccion(prodId) {
  setVentaSeleccionada((prev) =>
    prev.includes(prodId)
      ? prev.filter(id => id !== prodId)
      : [...prev, prodId]
  );
}



  

  return (
    <div>
      <h1>Punto de Venta</h1>

      {/* Categorías */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        {categorias.map((cat) => (
          <button key={cat.id} onClick={() => handleCategoriaClick(cat)}>
            {cat.nombre}
          </button>
        ))}
        <button onClick={fetchProductosSinCategoria}>Sin categoría</button>
      </div>

      {/* Productos visibles */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 20 }}>
        {productosVisibles.map((prod) => (
          <div key={prod.id} onClick={() => handleProductoClick(prod)} style={{ border: "1px solid #ccc", padding: 10, cursor: "pointer" }}>
            <strong>{prod.nombre}</strong><br />
            {prod.precio} €
            {prod.imagen && <img src={prod.imagen} style={{ width: 80, display: "block" }} />}
          </div>
        ))}
      </div>

      {/* Venta en curso */}
      <div style={{ marginTop: 30 }}>
        <h2>Venta actual</h2>
        {venta.length === 0 ? (
          <p>No hay productos añadidos</p>
        ) : (
<ul style={{ listStyle: "none", padding: 0 }}>
  {venta.map((item) => {
    const seleccionado = ventaSeleccionada.includes(item.producto.id);
    return (
      <li
        key={item.producto.id}
        onClick={() => toggleSeleccion(item.producto.id)}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 8,
          marginBottom: 5,
          backgroundColor: seleccionado ? "#cce5ff" : "#f9f9f9",
          border: "1px solid #ccc",
          borderRadius: 4,
          cursor: "pointer",
        }}
        title="Haz clic para seleccionar/desmarcar para pago parcial"
      >
        <span>
          {item.producto.nombre} x {item.cantidad} = {(item.producto.precio * item.cantidad).toFixed(2)} €
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation(); // para que no se dispare toggleSeleccion
            handleEliminarProducto(item.producto.id);
          }}
          style={{
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "50%",
            width: 24,
            height: 24,
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          ×
        </button>
      </li>
    );
  })}
</ul>


        )}

        {venta.length > 0 && (
          <div>
            <button onClick={() => handlePagar("efectivo")}>Pagar en efectivo</button>
            <button onClick={() => handlePagar("tarjeta")}>Pagar con tarjeta</button>
          </div>
        )}
      </div>
    </div>
  );
}
