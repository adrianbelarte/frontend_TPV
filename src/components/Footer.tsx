import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { abrirCajon } from "../utils/cajon"; // 👈 NUEVO
import {
  FaHome,
  FaCashRegister,
  FaUserShield,
  FaSignOutAlt,
  FaSignInAlt,
} from "react-icons/fa";

export default function Footer() {
  const { isLoggedIn, logout } = useAuth();

  // 👇 MEJORADA: función con async/await
  const handleAbrirCajon = async () => {
    try {
      await abrirCajon();
      alert("💰 Cajón abierto correctamente");
    } catch (error) {
      alert("❌ Error al abrir el cajón");
    }
  };

  return (
    <footer className="h-[50px] flex items-center justify-between bg-neutral-300 border-t border-neutral-400 px-6 text-sm text-gray-700 select-none">
      <ul className="flex items-center gap-6">
        <li>
          <Link
            to="/"
            className="flex items-center gap-2 hover:text-blue-600 transition-colors"
          >
            <FaHome className="text-lg" />
            <span>Home</span>
          </Link>
        </li>

        <li
          onClick={handleAbrirCajon}
          className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors"
        >
          <FaCashRegister className="text-lg" />
          <span>Cajón</span>
        </li>

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
