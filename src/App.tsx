// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
import PrivateRoute from "./components/PrivateRoute.jsx";

import Navbar from "./components/Navbar.jsx";
import HomePage from "./pages/Home/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import CategoriaPage from "./pages/CategoriaPage.jsx";
import EmpresaPage from "./pages/EmpresaPage.jsx";
import ProductoPage from "./pages/ProductoPage.jsx";
import TicketPage from "./pages/TicketPage.jsx";
import CierreCajaPage from "./pages/CierreCajaPage.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <ToastContainer />
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
      </BrowserRouter>
    </AuthProvider>
  );
}
