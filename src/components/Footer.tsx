import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
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
    // más adelante puedes llamar a la API de abrir cajón si está disponible
  };

  return (
    <footer className="h-[50px] flex items-center justify-between bg-neutral-300 border-t border-neutral-400 px-6 text-sm text-gray-700 select-none">
      <ul className="flex items-center gap-6">
        {/* Home */}
        <li>
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
        </li>

        {/* Cajón */}
        <li
          onClick={abrirCajon}
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
        >
          <FaCashRegister className="text-lg" />
          <span>Cajón</span>
        </li>

        {/* Admin */}
        <li>
          <Link
            to="/admin"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <FaUserShield className="text-lg" />
            <span>Admin</span>
          </Link>
        </li>
      </ul>

      <div>
        {isLoggedIn ? (
          <button
            onClick={logout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
          >
            <FaSignOutAlt className="text-lg" />
            <span>Cerrar sesión</span>
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center gap-2 text-green-600 hover:text-green-700 transition-colors"
          >
            <FaSignInAlt className="text-lg" />
            <span>Login</span>
          </Link>
        )}
      </div>
    </footer>
  );
}
