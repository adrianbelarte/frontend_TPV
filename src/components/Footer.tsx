import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();

  return (
    <footer className="footer">
      <ul className="footer-list">
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
    </footer>
  );
}
