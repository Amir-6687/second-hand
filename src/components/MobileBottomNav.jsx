// src/components/MobileBottomNav.jsx
import { NavLink } from "react-router-dom";
import { PiShoppingBagThin, PiHeartStraightThin } from "react-icons/pi";
import { CiSearch, CiHome, CiUser } from "react-icons/ci";

export default function MobileBottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 flex justify-around items-center h-14 md:hidden">
      <NavLink
        to="/"
        className="flex flex-col items-center text-[#b0b0b0] hover:text-pink-600"
      >
        <CiHome size={28} />
      </NavLink>
      <NavLink
        to="/search"
        className="flex flex-col items-center text-[#b0b0b0] hover:text-pink-600"
      >
        <CiSearch size={28} />
      </NavLink>
      <NavLink
        to="/cart"
        className="flex flex-col items-center text-[#b0b0b0] hover:text-pink-600"
      >
        <PiShoppingBagThin size={28} />
      </NavLink>
      <NavLink
        to="/favorites"
        className="flex flex-col items-center text-[#b0b0b0] hover:text-pink-600"
      >
        <PiHeartStraightThin size={28} />
      </NavLink>
      <NavLink
        to="/profile"
        className="flex flex-col items-center text-[#b0b0b0] hover:text-pink-600"
      >
        <CiUser size={28} />
      </NavLink>
    </nav>
  );
}
