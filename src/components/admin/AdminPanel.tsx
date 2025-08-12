import { useState } from "react";
import CategoriaContainer from "../Categoria/CategoriaContainer";
import ProductoContainer from "../Producto/ProductoContainer";
import EmpresaContainer from "../Empresa/EmpresaContainer";
import TicketsContainer from "../Ticket/TicketsContainer"; 
import CerrarCaja from "../caja/CerrarCaja"; 

import "./AdminPanel.css";

type OpcionAdmin = "productos" | "categorias" | "empresa" | "tickets" | "cerrarCaja";

export default function AdminPanel() {
  const [opcion, setOpcion] = useState<OpcionAdmin>("productos");

  const renderContenido = () => {
    switch (opcion) {
      case "productos":
        return <ProductoContainer />;
      case "categorias":
        return <CategoriaContainer />;
      case "empresa":
        return <EmpresaContainer />;
      case "tickets":
        return <TicketsContainer />;
      case "cerrarCaja":
        return <CerrarCaja />; // Importa antes este componente
      default:
        return <div>Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="admin-panel">
      <aside className="menu-admin">
        <h3>Administrador</h3>
        <ul>
          <li className={opcion === "productos" ? "active" : ""} onClick={() => setOpcion("productos")}>Productos</li>
          <li className={opcion === "categorias" ? "active" : ""} onClick={() => setOpcion("categorias")}>Categorías</li>
          <li className={opcion === "empresa" ? "active" : ""} onClick={() => setOpcion("empresa")}>Empresa</li>
          <li className={opcion === "tickets" ? "active" : ""} onClick={() => setOpcion("tickets")}>Tickets</li>
          <li className={opcion === "cerrarCaja" ? "active" : ""} onClick={() => setOpcion("cerrarCaja")}>Cerrar Caja</li>
        </ul>
      </aside>

      <section className="contenido-admin">{renderContenido()}</section>
    </div>
  );
}

