// src/components/MobileBottomNav.jsx
import { NavLink } from "react-router-dom";
import { PiShoppingBagThin, PiHeartStraightThin } from "react-icons/pi";
import { CiSearch, CiHome, CiUser } from "react-icons/ci";
import { IoClose } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";

export default function MobileBottomNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const searchRef = useRef(null);
  const { items } = useCart();
  const { wishlist } = useWishlist();

  const cartItemCount = items.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );
  const wishlistItemCount = wishlist.length;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(
        searchTerm.trim()
      )}`;
      setSearchTerm("");
      setSearchOpen(false);
    }
  };

  // Close search box when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        const searchIcon = event.target.closest("[data-mobile-search-icon]");
        if (searchIcon) {
          return;
        }
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchOpen]);

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 grid grid-cols-5 items-center h-14 md:hidden text-[#b0b0b0]">
        <NavLink
          to="/"
          className="flex flex-col items-center justify-center hover:text-pink-600"
        >
          <CiHome size={28} />
        </NavLink>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          className={`flex flex-col items-center justify-center hover:text-pink-600 ${
            searchOpen ? "text-pink-600" : ""
          }`}
          data-mobile-search-icon
        >
          <CiSearch size={28} />
        </button>
        <NavLink
          to="/cart"
          className="flex flex-col items-center justify-center hover:text-pink-600 relative"
        >
          <PiShoppingBagThin size={28} />
          {cartItemCount > 0 && (
            <div className="absolute -top-1 -right-1 md:-right-1 -right-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {cartItemCount}
            </div>
          )}
        </NavLink>
        <NavLink
          to="/favorites"
          className="flex flex-col items-center justify-center hover:text-pink-600 relative"
        >
          <PiHeartStraightThin size={28} />
          {wishlistItemCount > 0 && (
            <div className="absolute -top-1 -right-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
              {wishlistItemCount}
            </div>
          )}
        </NavLink>
        <NavLink
          to="/profile"
          className="flex flex-col items-center justify-center hover:text-pink-600"
        >
          <CiUser size={28} />
        </NavLink>
      </nav>

      {/* Mobile SearchBox */}
      <div
        ref={searchRef}
        className="fixed bottom-14 left-0 right-0 bg-white shadow-lg border-t border-gray-200 z-40 transform transition-all duration-300 ease-in-out md:hidden"
        style={{
          transform: searchOpen ? "translateY(0)" : "translateY(100%)",
          opacity: searchOpen ? 1 : 0,
          pointerEvents: searchOpen ? "auto" : "none",
        }}
      >
        <form onSubmit={handleSearch} className="p-4">
          <div className="flex items-center bg-gray-50 rounded-full px-4 py-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="flex-1 bg-transparent outline-none text-gray-900"
              autoFocus
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm("")}
                className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <IoClose size={18} className="text-gray-500" />
              </button>
            )}
            <button
              type="submit"
              className="ml-2 p-1 hover:bg-gray-200 rounded-full transition-colors"
            >
              <CiSearch size={20} className="text-gray-600" />
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
