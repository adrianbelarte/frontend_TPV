import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Footer.css";
import {
  FaHome,
  FaCashRegister,
  FaUserShield,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();

  const abrirCajon = () => {
    alert("Abriendo cajón...");
  };


  return (
    <footer className="footer">
      <ul className="footer-list">
        <li>
          <Link to="/">
            <FaHome className="icon" /> Home
          </Link>
        </li>
        <li onClick={abrirCajon}>
          <FaCashRegister className="icon" /> Cajón
        </li>
        <li>
  <Link to="/admin">
    <FaUserShield className="icon" /> Admin
  </Link>
</li>


        {isLoggedIn ? (
          <li>
            <button className="logout-button" onClick={logout}>
              <FaSignOutAlt className="icon" /> Cerrar sesión
            </button>
          </li>
        ) : (
          <li>
            <Link to="/login">
              <FaSignInAlt className="icon" /> Login
            </Link>
          </li>
        )}
      </ul>
    </footer>
  );
}
