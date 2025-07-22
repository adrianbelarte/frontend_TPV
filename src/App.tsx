// App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import CategoriaPage from "./pages/CategoriaPage";
import EmpresaPage from "./pages/EmpresaPage";
import ProductoPage from "./pages/ProductoPage";
import TicketPage from "./pages/TicketPage";
import VentaTotalPage from "./pages/VentaTotalPage";

function Navigation() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav>
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/categoria">Categorías</Link></li>
        <li><Link to="/empresa">Empresas</Link></li>
        <li><Link to="/producto">Productos</Link></li>
        <li><Link to="/ticket">Tickets</Link></li>
        <li><Link to="/ventaTotal">Ventas</Link></li>

        {isLoggedIn ? (
          <>
            <li><button onClick={logout}>Cerrar sesión</button></li>
          </>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navigation />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas públicas (solo lectura) */}
          <Route path="/categoria" element={<CategoriaPage />} />
          <Route path="/empresa" element={<EmpresaPage />} />
          <Route path="/producto" element={<ProductoPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/ventaTotal" element={<VentaTotalPage />} />

          {/* Rutas protegidas para acciones admin (crear/editar/borrar) */}
          {/* Por ejemplo podrías crear rutas específicas o proteger componentes según la acción */}
          {/* Aquí un ejemplo para ruta editar producto: */}
          <Route path="/producto/edit/:id" element={
            <PrivateRoute>
              {/* componente edición producto */}
            </PrivateRoute>
          } />
          {/* Similar para otras rutas con modificaciones */}
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
