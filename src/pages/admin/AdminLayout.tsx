import { NavLink, Outlet } from "react-router-dom";
import {
  FaBoxOpen,
  FaTags,
  FaBuilding,
  FaReceipt,
  FaCashRegister,
  FaPrint,
} from "react-icons/fa";

export default function AdminLayout() {
  // estilos base reutilizables
  const tileBase =
    "flex items-center gap-3 p-3 rounded-xl border transition-all select-none shadow-sm";
  const tileInactive =
    "border-neutral-200 bg-white hover:bg-neutral-50 hover:shadow-md hover:ring-2 hover:ring-blue-100";
  const tileActive =
    "border-blue-300 bg-blue-50 ring-2 ring-blue-200 shadow-md";

  const labelBase = "text-sm font-medium";
  const labelInactive = "text-neutral-700";
  const labelActive = "text-blue-800";

  return (
    <div className="grid h-full grid-cols-[240px_1fr] ">
      {/* Sidebar */}
      <aside className="border-r border-neutral-200 bg-neutral-50">
        {/* Header administrador */}
        <div className="px-4 py-4">
          <div className="inline-flex items-center gap-2 rounded-lg bg-neutral-200/60 px-3 py-1">
            <span className="text-xs font-semibold tracking-wide text-neutral-700">
              ADMINISTRADOR
            </span>
          </div>
          <p className="mt-2 text-[13px] text-neutral-500">
            Panel de control del TPV
          </p>
        </div>

        {/* Caja de menú */}
        <nav className="px-4 pb-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm">
            <h4 className="px-2 pb-2 text-xs font-semibold tracking-wide text-neutral-500">
              MENÚ
            </h4>

            <ul className="grid gap-2 ">
              <li>
                <NavLink
                  to="productos"
                  className={({ isActive }) =>
                    `${tileBase} ${isActive ? tileActive : tileInactive}`
                  }
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-100 text-blue-600">
                    <FaBoxOpen />
                  </div>
                  <span
                    className={`${labelBase} ${
                      location.pathname.endsWith("/productos")
                        ? labelActive
                        : labelInactive
                    }`}
                  >
                    Productos
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="categorias"
                  className={({ isActive }) =>
                    `${tileBase} ${isActive ? tileActive : tileInactive}`
                  }
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 text-emerald-600">
                    <FaTags />
                  </div>
                  <span className={`${labelBase} ${labelInactive}`}>
                    Categorías
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="empresa"
                  className={({ isActive }) =>
                    `${tileBase} ${isActive ? tileActive : tileInactive}`
                  }
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-amber-100 text-amber-600">
                    <FaBuilding />
                  </div>
                  <span className={`${labelBase} ${labelInactive}`}>
                    Empresa
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="tickets"
                  className={({ isActive }) =>
                    `${tileBase} ${isActive ? tileActive : tileInactive}`
                  }
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-violet-100 text-violet-600">
                    <FaReceipt />
                  </div>
                  <span className={`${labelBase} ${labelInactive}`}>
                    Tickets
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="cerrar-caja"
                  className={({ isActive }) =>
                    `${tileBase} ${isActive ? tileActive : tileInactive}`
                  }
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-rose-100 text-rose-600">
                    <FaCashRegister />
                  </div>
                  <span className={`${labelBase} ${labelInactive}`}>
                    Cerrar Caja
                  </span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="impresora"
                  className={({ isActive }) =>
                    `${tileBase} ${isActive ? tileActive : tileInactive}`
                  }
                >
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-teal-100 text-teal-600">
                    <FaPrint />
                  </div>
                  <span className={`${labelBase} ${labelInactive}`}>
                    Ajustes Impresora
                  </span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Contenido */}
      <section className="overflow-auto bg-white p-5">
        <Outlet />
      </section>
    </div>
  );
}
