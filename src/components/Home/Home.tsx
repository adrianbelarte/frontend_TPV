import { useEffect, useState } from "react";
import { api } from "../../config/api";

import VentaPanel from "./VentaPanel";
import Totales from "./Totales";
import CategoriaSelector from "./CategoriaSelector";
import ProductoGrid from "./ProductoGrid";
import { TicketGenerado, type TicketData } from "../../components/Ticket/TicketGenerado";

import type { Producto } from "../../types/producto";
import type { Categoria } from "../../types/categoria";
import type { VentaItem } from "../../types/venta";

const MODO_SIMULACION = import.meta.env.VITE_MODO_SIMULACION === "true";

export default function Home() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productosVisibles, setProductosVisibles] = useState<Producto[]>([]);
  const [venta, setVenta] = useState<VentaItem[]>([]);
  const [input, setInput] = useState("");
  const [ticketGenerado, setTicketGenerado] = useState<TicketData | null>(null);
  const [tipoPago, setTipoPago] = useState<"efectivo" | "tarjeta">("efectivo");

  useEffect(() => {
    api.get<Categoria[]>("/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => alert("Error cargando categorías: " + err.message));

    fetchProductosSinCategoria();
  }, []);

  const fetchProductosSinCategoria = async () => {
    try {
      const { data: allProductos } = await api.get<Producto[]>("/productos");
      const sinCategoria = allProductos.filter((p) => !p.categoriaId);
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
      const { data } = await api.get<Producto[]>(`/categorias/${idNumber}/productos`);
      setProductosVisibles(data);
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
    setTipoPago(tipo);

    if (venta.length === 0) {
      alert("No hay productos en la venta");
      return;
    }

    const fecha = new Date().toLocaleString();
    const total = venta.reduce(
      (s, i) => s + Number(i.cantidad) * Number(i.producto.precio),
      0
    );
    const totalFixed = Number(total.toFixed(2));

    try {
      await api.post("/tickets", {
        tipo_pago: tipo,
        fecha,
        total: totalFixed,
        productos: venta.map((i) => ({
          productoId: i.producto.id,
          cantidad: i.cantidad,
        })),
      });
    } catch (e: any) {
      alert("Error guardando ticket: " + (e?.message || "Desconocido"));
      return;
    }

    try {
      if (!MODO_SIMULACION) {
        await api.post("/imprimir", {
          fecha,
          productos: venta.map((i) => ({
            nombre: i.producto.nombre,
            cantidad: i.cantidad,
            precio: Number(i.producto.precio),
          })),
          total: totalFixed,
          tipo_pago: tipo,
          empresa: { nombre: "TPV Grupo Manhattan" },
        });
      } else {
        console.log("Simulación de impresión:", { fecha, productos: venta, total: totalFixed, tipo_pago: tipo });
      }
    } catch (e: any) {
      console.warn("Fallo imprimiendo ticket:", e);
      alert("Ticket guardado, pero falló la impresión.");
    }

    setTicketGenerado({
      fecha,
      productos: venta.map((i) => ({
        nombre: i.producto.nombre,
        cantidad: i.cantidad,
      })),
      total: totalFixed.toFixed(2),
      tipo_pago: tipo,
    });

    setVenta([]);
    setInput("");
  };

  const totalVenta = venta.reduce(
    (acc, item) => acc + Number(item.cantidad) * Number(item.producto.precio),
    0
  );

  return (
    <div className="flex h-full w-full gap-4 p-3 text-gray-800">
      {/* Panel de venta */}
      <div className="w-1/3 h-[700px] flex flex-col gap-3 p-4 bg-white rounded-lg shadow-md">
        <VentaPanel venta={venta} eliminarProd={eliminarProd} />
        <Totales input={input} totalVenta={totalVenta} pagar={pagar} />
      </div>

      {/* Panel de productos */}
      <div className="w-2/3 h-[700px] flex flex-col p-4 bg-white rounded-lg shadow-md border border-gray-200">
        <CategoriaSelector categorias={categorias} filtrarCategoria={filtrarCategoria} />
        <ProductoGrid productos={productosVisibles} onAgregar={agregarProd} />
      </div>

      {ticketGenerado && (
        <div className="absolute right-4 bottom-16 bg-white p-3 rounded-md shadow-lg border border-gray-200">
          <TicketGenerado
            ticket={ticketGenerado}
            modoSimulacion={MODO_SIMULACION}
            tipoPago={tipoPago}
          />
        </div>
      )}
    </div>
  );
}
