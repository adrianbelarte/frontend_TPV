import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import Footer from "./components/Footer"; // renombrado para mayor claridad
import HomePage from "./pages/Home/HomePage";
import LoginPage from "./pages/LoginPage";
import CategoriaPage from "./pages/CategoriaPage";
import EmpresaPage from "./pages/EmpresaPage";
import ProductoPage from "./pages/ProductoPage";
import TicketPage from "./pages/TicketPage";
import CierreCajaPage from "./pages/CierreCajaPage";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css"; // importa aquí los estilos globales, incluyendo main

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Footer />
        <ToastContainer />
        <main>
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
            <Route
              path="/cierre-caja"
              element={
                <PrivateRoute>
                  <CierreCajaPage />
                </PrivateRoute>
              }
            />

            {/* Ruta protegida de ejemplo para edición */}
            <Route
              path="/producto/edit/:id"
              element={
                <PrivateRoute>
                  <div>Editar producto (componente por definir)</div>
                </PrivateRoute>
              }
            />
          </Routes>
        </main>
      </BrowserRouter>
    </AuthProvider>
  );
}
