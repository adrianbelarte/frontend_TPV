import { Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CategoriaPage from "./pages/CategoriaPage";
import EmpresaPage from "./pages/EmpresaPage";
import ProductoPage from "./pages/ProductoPage";
import TicketPage from "./pages/TicketPage";
import Footer from "./components/Footer";

import AdminLayout from "./pages/admin/AdminLayout";
import ProductosAdmin from "./pages/admin/ProductosAdmin";
import CategoriasAdmin from "./pages/admin/CategoriasAdmin";
import EmpresaAdmin from "./pages/admin/EmpresaAdmin";
import TicketsAdmin from "./pages/admin/TicketsAdmin";
import CerrarCajaAdmin from "./pages/admin/CerrarCajaAdmin";
import PrinterSettingsAdmin from "./pages/admin/PrinterSettingsAdmin";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <ToastContainer />

      {/* Wrapper a pantalla completa para centrar la app y dar fondo */}
      <div className="min-h-screen w-full bg-neutral-100 flex items-center justify-center">
        {/* Caja fija 1024x768 */}
        <div className="w-[1024px] h-[768px] flex flex-col overflow-hidden border-2 border-neutral-400 rounded-xl bg-neutral-200 shadow-sm">
          {/* Main ocupa todo el alto menos Footer */}
          <main className="flex-1 overflow-hidden">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />

              <Route
                path="/categoria"
                element={
                  <PrivateRoute>
                    <CategoriaPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/empresa"
                element={
                  <PrivateRoute>
                    <EmpresaPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/producto"
                element={
                  <PrivateRoute>
                    <ProductoPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="/ticket"
                element={
                  <PrivateRoute>
                    <TicketPage />
                  </PrivateRoute>
                }
              />

              {/* Admin con rutas anidadas */}
              <Route
                path="/admin"
                element={
                  <PrivateRoute>
                    <AdminLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="productos" replace />} />
                <Route path="productos" element={<ProductosAdmin />} />
                <Route path="categorias" element={<CategoriasAdmin />} />
                <Route path="empresa" element={<EmpresaAdmin />} />
                <Route path="tickets" element={<TicketsAdmin />} />
                <Route path="cerrar-caja" element={<CerrarCajaAdmin />} />
                <Route path="impresora" element={<PrinterSettingsAdmin />} />
              </Route>

              {/* 404 opcional */}
              {/* <Route path="*" element={<div className="p-4">404</div>} /> */}
            </Routes>
          </main>

          <Footer />
        </div>
      </div>
    </AuthProvider>
  );
}
