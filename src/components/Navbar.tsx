// src/components/Navbar.jsx
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { isLoggedIn, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <ul className="navbar-list">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/categoria">Categorías</Link></li>
        <li><Link to="/empresa">Empresas</Link></li>
        <li><Link to="/producto">Productos</Link></li>
        <li><Link to="/ticket">Tickets</Link></li>
        <li><Link to="/cierre-caja">Cierre caja</Link></li>

        {isLoggedIn ? (
          <li>
            <button className="logout-button" onClick={logout}>Cerrar sesión</button>
          </li>
        ) : (
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
}
