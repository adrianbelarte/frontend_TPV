import { useEffect, useState } from "react";
import { authFetch } from "../../utils/authFetch";
import { api } from "../../config/api";

import VentaPanel from "./VentaPanel";
import Totales from "./Totales";
import CategoriaSelector from "./CategoriaSelector";
import ProductoGrid from "./ProductoGrid";
import { TicketGenerado, type TicketData } from "../../components/Ticket/TicketGenerado";

import type { Producto } from "../../types/producto"; 
import type { Categoria } from "../../types/categoria";
import type { VentaItem } from "../../types/venta";  
import "./Home.css";

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosVisibles, setProductosVisibles] = useState<Producto[]>([]);
  const [venta, setVenta] = useState<VentaItem[]>([]);
  const [input, setInput] = useState("");
  const [ticketGenerado, setTicketGenerado] = useState<TicketData | null>(null);

  useEffect(() => {
    authFetch(api("/api/categorias"))
      .then(setCategorias)
      .catch((err) => alert("Error cargando categorías: " + err.message));

    fetchProductosSinCategoria();
  }, []);

  const fetchProductosSinCategoria = async () => {
    try {
      const allProductos = await authFetch(api("/api/productos"));
      const sinCategoria = (allProductos as Producto[]).filter(
        (p) => !p.categoriaId
      );
      setProductosVisibles(sinCategoria);
    } catch (err: any) {
      alert("Error cargando productos sin categoría: " + err.message);
    }
  };

  const filtrarCategoria = async (catId: string | number | null) => {
    let idNumber: number | null = null;
    if (catId !== null) {
      idNumber = typeof catId === "string" ? parseInt(catId, 10) : catId;
      if (isNaN(idNumber)) {
        alert("ID de categoría inválido");
        return;
      }
    }

    if (idNumber === null) {
      fetchProductosSinCategoria();
      return;
    }

    try {
      const data = await authFetch(api(`/api/categorias/${idNumber}/productos`));
      setProductosVisibles(data as Producto[]);
    } catch (err: any) {
      alert("Error cargando productos de la categoría: " + err.message);
    }
  };

  const agregarProd = (prod: Producto) => {
    setVenta((prev) => {
      const ex = prev.find((i) => i.producto.id === prod.id);
      if (ex) {
        return prev.map((i) =>
          i.producto.id === prod.id ? { ...i, cantidad: i.cantidad + 1 } : i
        );
      }
      return [...prev, { producto: prod, cantidad: 1 }];
    });
  };

  const eliminarProd = (prodId: number) => {
    setVenta((prev) => {
      const ex = prev.find((i) => i.producto.id === prodId);
      if (!ex) return prev;
      if (ex.cantidad > 1) {
        return prev.map((i) =>
          i.producto.id === prodId ? { ...i, cantidad: i.cantidad - 1 } : i
        );
      }
      return prev.filter((i) => i.producto.id !== prodId);
    });
  };

const pagar = async (tipo: "efectivo" | "tarjeta") => {
  try {
    const fecha = new Date().toLocaleString();
    const total = venta.reduce((s, i) => s + i.cantidad * i.producto.precio, 0);

    // Guardar el ticket en backend
    await authFetch(api("/api/tickets"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo_pago: tipo,
        fecha,
        total,
        productos: venta.map((i) => ({
          productoId: i.producto.id,
          cantidad: i.cantidad,
        })),
      }),
    });

    // Mandar a imprimir
    await authFetch(api("/api/imprimir"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fecha,
        productos: venta.map((i) => ({
          nombre: i.producto.nombre,
          cantidad: i.cantidad,
        })),
        total: total.toFixed(2),
      }),
    });

    // Guardamos datos para el ticket visual
    setTicketGenerado({
      fecha,
      productos: venta.map((i) => ({
        nombre: i.producto.nombre,
        cantidad: i.cantidad,
      })),
      total: total.toFixed(2),
    });

    setVenta([]);
    setInput("");
  } catch (e: any) {
    alert(e.message);
  }
};


  const totalVenta = venta.reduce(
    (acc, item) => acc + item.cantidad * item.producto.precio,
    0
  );

  return (
    <div className="home-container">
      <div className="panel-venta">
        <VentaPanel venta={venta} eliminarProd={eliminarProd} />
        <Totales input={input} totalVenta={totalVenta} pagar={pagar} />
      </div>

      <div className="productos">
        <CategoriaSelector categorias={categorias} filtrarCategoria={filtrarCategoria} />
        <ProductoGrid productos={productosVisibles} onAgregar={agregarProd} />
      </div>

      {ticketGenerado && (
        <div className="ticket-preview">
          <TicketGenerado ticket={ticketGenerado} />
        </div>
      )}
    </div>
  );
}

// <Calculator value={input} onChange={setInput} />
