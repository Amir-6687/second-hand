// src/components/MobileBottomNav.jsx
import { NavLink } from "react-router-dom";
import {
  AiOutlineHome,
  AiOutlineShoppingCart,
  AiOutlineHeart,
  AiOutlineUser,
} from "react-icons/ai";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-14 md:hidden">
      <NavLink
        to="/"
        className="flex flex-col items-center text-gray-600 hover:text-pink-600"
      >
        <AiOutlineHome size={24} />
        <span className="text-xs">Home</span>
      </NavLink>
      <NavLink
        to="/cart"
        className="flex flex-col items-center text-gray-600 hover:text-pink-600"
      >
        <AiOutlineShoppingCart size={24} />
        <span className="text-xs">Cart</span>
      </NavLink>
      <NavLink
        to="/favorites"
        className="flex flex-col items-center text-gray-600 hover:text-pink-600"
      >
        <AiOutlineHeart size={24} />
        <span className="text-xs">Favorites</span>
      </NavLink>
      <NavLink
        to="/profile"
        className="flex flex-col items-center text-gray-600 hover:text-pink-600"
      >
        <AiOutlineUser size={24} />
        <span className="text-xs">Profile</span>
      </NavLink>
    </nav>
  );
}
