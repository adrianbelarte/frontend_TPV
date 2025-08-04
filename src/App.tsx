import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CategoriaPage from "./pages/CategoriaPage";
import EmpresaPage from "./pages/EmpresaPage";
import ProductoPage from "./pages/ProductoPage";
import TicketPage from "./pages/TicketPage";
import CierreCajaPage from "./pages/CierreCajaPage";
import Footer from "./components/Footer";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AdminPage from "./pages/AdminPage";

import "./App.css"; 

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer />
        <div className="app-container">
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
            <Route
  path="/admin"
  element={
    <PrivateRoute>
      <AdminPage />
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
        <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}
