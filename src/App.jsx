import React, { useState } from "react";
import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Products from "./pages/Products";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import { CartProvider } from "./context/CartContext";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Admin from "./pages/Admin";
import Footer from "./components/Footer";
import logo from "./assets/logo.png";
import Profile from "./pages/Profile";
import UpdatePassword from "./pages/UpdatePassword";
import MobileBottomNav from "./components/MobileBottomNav";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "./pages/Wishlist";
import ProductDetail from "./pages/ProductDetail";
import {
  CiUser,
  CiLogin,
  CiLogout,
  CiSearch,
  CiShoppingBasket,
} from "react-icons/ci";
import { RiAdminLine, RiUserLine } from "react-icons/ri";

// import { HiOutlineUser } from "react-icons/hi";

// Tooltip for Admin icon (desktop only)
function AdminIconWithTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center md:flex hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
    >
      <RiAdminLine size={18} className="cursor-pointer" />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/70 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Admin
        </div>
      )}
    </div>
  );
}

// Tooltip for User icon (desktop only)
function UserIconWithTooltip() {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center md:flex hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
    >
      <RiUserLine className="w-5 h-5 cursor-pointer" />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/70 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          User
        </div>
      )}
    </div>
  );
}

// Tooltip for Logout icon (desktop only)
function LogoutIconWithTooltip({ onClick }) {
  const [show, setShow] = useState(false);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center text-red-500 hover:underline md:flex hidden"
      style={{ background: "none", border: "none", padding: 0 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
    >
      <CiLogout size={28} />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Logout
        </div>
      )}
    </button>
  );
}

// Tooltip for Login icon (desktop only)
function LoginIconWithTooltip() {
  const [show, setShow] = useState(false);
  return (
    <NavLink
      to="/login"
      className="relative flex items-center md:flex hidden"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
    >
      <CiLogin size={28} />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Login
        </div>
      )}
    </NavLink>
  );
}

// Tooltip for Search icon (desktop only)
function SearchIconWithTooltip({ onClick }) {
  const [show, setShow] = useState(false);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center md:flex hidden"
      style={{ background: "none", border: "none", padding: 0, marginRight: 4 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
    >
      <CiSearch size={28} />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Search
        </div>
      )}
    </button>
  );
}

// Tooltip for Shop/Cart icon (desktop only)
function ShopIconWithTooltip({ onClick }) {
  const [show, setShow] = useState(false);
  return (
    <button
      onClick={onClick}
      className="relative flex items-center md:flex hidden"
      style={{ background: "none", border: "none", padding: 0, marginLeft: 4 }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      tabIndex={0}
      type="button"
    >
      <CiShoppingBasket size={28} />
      {show && (
        <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-white/80 text-black text-xs rounded shadow z-50 whitespace-nowrap backdrop-blur-md border border-gray-200">
          Shop
        </div>
      )}
    </button>
  );
}

function Navigation() {
  const { user, username, role, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = window.location
    ? (path) => (window.location.href = path)
    : () => {};

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const closeMenu = () => setMenuOpen(false);

  return (
    <>
      <nav className="bg-white text-gray-900 p-4 shadow-md flex items-center justify-between relative">
        {/* لوگو */}
        <div className="text-xl font-bold flex items-center gap-2">
          <NavLink to="/" aria-label="Home">
            <img
              src={logo}
              alt="Shop Logo"
              className="h-32 w-auto cursor-pointer"
            />
          </NavLink>
        </div>

        {/* منو - فقط دسکتاپ */}
        <div className="hidden md:flex items-center gap-6">
          {["/", "/services", "/about", "/cart", "/favorites"].map(
            (path, idx) => {
              const names = [
                "Home",
                "Services",
                "About Us",
                "Cart",
                "Favorites",
              ];
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `${
                      isActive ? "underline font-semibold" : ""
                    } py-2 px-4 hover:-translate-y-1 hover:scale-105 hover:text-pink-600 transition-transform duration-200 ease-in-out`
                  }
                >
                  {names[idx]}
                </NavLink>
              );
            }
          )}
        </div>

        {/* Login/Search/Cart - دسکتاپ */}
        <div className="hidden md:flex items-center gap-4 text-sm">
          {user ? (
            <>
              <NavLink
                to="/profile"
                onClick={closeMenu}
                className="hover:text-pink-600 flex items-center gap-1"
              >
                <UserIconWithTooltip />
                {username || "Profile"}
              </NavLink>

              {role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={closeMenu}
                  className="md:flex hidden"
                >
                  <AdminIconWithTooltip />
                </NavLink>
              )}
              <LogoutIconWithTooltip
                onClick={() => {
                  logout();
                  closeMenu();
                }}
              />
            </>
          ) : (
            <>
              <SearchIconWithTooltip onClick={() => navigate("/search")} />
              <LoginIconWithTooltip />
              <ShopIconWithTooltip onClick={() => navigate("/cart")} />
            </>
          )}
        </div>

        {/* دکمه موبایل */}
        <div className="md:hidden z-50">
          <button
            onClick={toggleMenu}
            aria-label="Toggle menu"
            className="focus:outline-none z-50 text-black"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 12h16"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 18h16"
                  />
                </>
              )}
            </svg>
          </button>
        </div>

        {/* بکدراپ موبایل */}
        {menuOpen && (
          <div
            onClick={closeMenu}
            className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          />
        )}

        {/* منوی موبایل */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-pink-100 shadow-lg transform transition-transform duration-500 ease-in-out z-40
      ${menuOpen ? "translate-x-0" : "translate-x-full"}
      pt-24 md:hidden
    `}
        >
          {["/", "/services", "/about", "/cart"].map((path, idx) => {
            const names = ["Home", "Services", "About Us", "Cart"];
            return (
              <NavLink
                key={path}
                to={path}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `${
                    isActive ? "underline font-semibold" : ""
                  } block py-2 px-4 text-center hover:-translate-y-1 hover:scale-105 hover:text-pink-600 transition-transform duration-200 ease-in-out`
                }
              >
                {names[idx]}
              </NavLink>
            );
          })}

          <div className="mt-4 flex flex-col items-center gap-2 text-sm justify-center">
            {user ? (
              <>
                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className="hover:text-pink-600 flex items-center gap-1"
                >
                  <CiUser className="w-5 h-5" />
                  {username || "Profile"}
                </NavLink>
                {role === "admin" && (
                  <NavLink to="/admin" onClick={closeMenu}>
                    <RiAdminLine />
                  </NavLink>
                )}
                <button
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                  className="text-red-500 hover:underline flex items-center justify-center mt-6"
                  style={{ background: "none", border: "none", padding: 0 }}
                >
                  <CiLogout size={28} />
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  onClick={closeMenu}
                  className="flex items-center justify-center"
                >
                  <CiLogin size={28} />
                </NavLink>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ✅ خط باریک زیر Navigation */}
      <div className="h-px bg-gray-300" />
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <BrowserRouter>
            {/* محفظه اصلی با فاصله چپ/راست و خطوط باریک کناری */}
            <div className="relative min-h-screen bg-white">
              {/* خطوط باریک عمودی (فقط دسکتاپ) */}
              <div className="hidden md:block absolute top-0 bottom-0 left-[15%] w-px bg-gray-300 z-10" />
              <div className="hidden md:block absolute top-0 bottom-0 right-[15%] w-px bg-gray-300 z-10" />

              {/* محتوای اصلی با فاصله ۱۵٪ از چپ و راست */}
              <div className="px-0 md:px-[15%]">
                <Navigation />

                <main>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/products" element={<Products />} />
                    <Route
                      path="/checkout"
                      element={
                        <ProtectedRoute>
                          <Checkout />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/payment-success"
                      element={<PaymentSuccess />}
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/admin"
                      element={
                        <ProtectedRoute requiredRole="admin">
                          <Admin />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <ProtectedRoute>
                          <Profile />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/update-password"
                      element={<UpdatePassword />}
                    />
                    <Route path="/favorites" element={<Wishlist />} />
                    <Route path="/products/:id" element={<ProductDetail />} />
                  </Routes>
                </main>

                <Footer />
                <MobileBottomNav />
              </div>
            </div>
          </BrowserRouter>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}
