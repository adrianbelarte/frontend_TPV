// App.jsx
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useContext } from "react";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CategoriaPage from "./pages/CategoriaPage";
import EmpresaPage from "./pages/EmpresaPage";
import ProductoPage from "./pages/ProductoPage";
import TicketPage from "./pages/TicketPage";
import VentaTotalPage from "./pages/VentaTotalPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
        <li><Link to="/ventaTotal">Cierre caja</Link></li>

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
        <ToastContainer />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Rutas públicas (solo lectura) */}
          <Route path="/categoria" element={
  <PrivateRoute>
    <CategoriaPage />
  </PrivateRoute>
} />
<Route path="/empresa" element={
  <PrivateRoute>
    <EmpresaPage />
  </PrivateRoute>
} />
<Route path="/producto" element={
  <PrivateRoute>
    <ProductoPage />
  </PrivateRoute>
} />
<Route path="/ticket" element={
  <PrivateRoute>
    <TicketPage />
  </PrivateRoute>
} />
<Route path="/ventaTotal" element={
  <PrivateRoute>
    <VentaTotalPage />
  </PrivateRoute>
} />


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
