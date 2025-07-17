import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../lib/api";
import { useWishlist } from "../context/WishlistContext";
import { FiChevronDown } from "react-icons/fi";
import { RiArrowRightWideFill, RiArrowLeftWideFill } from "react-icons/ri";

export default function Cart() {
  const {
    items,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
  const { toggleWishlist } = useWishlist();

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  if (items.length === 0) {
    return (
      <div className="text-center mt-20">
        <h2 className="text-2xl font-semibold text-gray-700">
          Dein Warenkorb ist leer 🛒
        </h2>
        <Link
          to="/products"
          className="inline-block mt-4 text-blue-600 hover:underline"
        >
          Zurück zu den Produkten
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded shadow mt-10">
      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 flex items-center justify-between px-4 py-3">
        <span className="text-xl font-bold">Cart</span>
        <Link
          to="/checkout"
          className="bg-[#e11d48] hover:bg-[#be123c] text-white font-semibold rounded-lg px-6 py-2 text-base shadow transition"
          style={{ minWidth: 120, textAlign: "center" }}
        >
          Checkout
        </Link>
      </div>

      {/* Desktop top bar */}
      <div className="w-full items-center justify-between mb-6 px-2 md:px-0 hidden md:flex">
        <span className="text-xl font-bold md:text-2xl">Cart</span>
        <a
          href="/checkout"
          className="px-5 py-2 rounded bg-teal-700 text-white font-semibold hover:bg-teal-800 transition text-base md:text-lg shadow md:bg-red-600 md:hover:bg-red-700"
          style={{ minWidth: 120, textAlign: "center" }}
        >
          Checkout{" "}
          <RiArrowRightWideFill className="inline ml-2 -mr-1" size={20} />
        </a>
      </div>

      {/* خط جداکننده از چپ تا راست کامل */}
      <div className="-mx-6">
        <hr className="border-t-4 border-gray-300 mb-6" />
      </div>

      <ul className="space-y-0">
        {items.map((item, index) => (
          <li key={item._id} className="relative pt-4 pb-6">
            {/* خط جداکننده بین محصولات */}
            {index > 0 && (
              <div className="-mx-6">
                <hr className="border-t border-gray-300 mb-4" />
              </div>
            )}

            <div className="flex gap-4 items-start min-h-[160px] relative">
              {/* Remove button */}
              <button
                onClick={() => removeFromCart(item._id)}
                className="absolute top-2 right-2 text-black hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-3xl font-thin tracking-tighter"
                aria-label="Remove from cart"
              >
                ×
              </button>

              {/* Image + quantity */}
              <div className="flex flex-col items-start gap-2 flex-shrink-0">
                {item.images?.length > 0 ? (
                  <Link to={`/products/${item._id}`}>
                    <img
                      src={BASE_URL + item.images[0]}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded mb-1 cursor-pointer hover:opacity-90 transition"
                    />
                  </Link>
                ) : item.image ? (
                  <Link to={`/products/${item._id}`}>
                    <img
                      src={BASE_URL + item.image}
                      alt={item.name}
                      className="w-24 h-24 object-cover rounded mb-1 cursor-pointer hover:opacity-90 transition"
                    />
                  </Link>
                ) : null}

                {/* Quantity Selector */}
                <div className="flex flex-col items-start w-full">
                  <label
                    className="text-xs text-gray-500 mb-1"
                    htmlFor={`qty-${item._id}`}
                  >
                    Quantity
                  </label>
                  <div className="relative w-20">
                    <select
                      id={`qty-${item._id}`}
                      className="block w-full border border-gray-300 rounded-xl px-3 py-2 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                      value={item.quantity || 1}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        const diff = val - (item.quantity || 1);
                        if (diff > 0) {
                          for (let i = 0; i < diff; i++)
                            increaseQuantity(item._id);
                        } else if (diff < 0) {
                          for (let i = 0; i < -diff; i++)
                            decreaseQuantity(item._id);
                        }
                      }}
                    >
                      {[1, 2, 3, 4, 5].map((n) => (
                        <option key={n} value={n}>
                          {n}
                        </option>
                      ))}
                    </select>
                    <FiChevronDown
                      className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Name + wishlist + price */}
              <div className="flex-1 flex flex-col gap-1 min-w-[120px] pr-6">
                <p className="font-semibold text-base mb-1">{item.name}</p>
                <button
                  className="text-gray-500 text-sm hover:text-pink-500 transition w-fit"
                  onClick={() => {
                    toggleWishlist(item._id);
                    removeFromCart(item._id);
                  }}
                >
                  Add to Wishlist
                </button>

                <div className="border-b border-gray-200 w-full mt-1 mb-2" />

                {/* Price fixed at bottom-right */}
                <span className="absolute bottom-4 right-4 text-sm font-bold text-gray-800">
                  €{item.price.toFixed(2)}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <div className="-mx-6">
        <hr className="border-t-4 border-gray-300 mb-6" />
      </div>

      <div className="mt-6 flex justify-between items-center pt-4">
        <p className="text-lg font-bold">Total: €{total.toFixed(2)}</p>
      </div>

      {/* Mobile bottom action buttons */}
      <div className="md:hidden mt-6 flex flex-col gap-4">
        <Link
          to="/checkout"
          className="w-full flex items-center justify-between bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-lg rounded-2xl py-4 px-6 shadow transition"
          style={{ minHeight: 56 }}
        >
          <span className="mx-auto">Checkout</span>
          <RiArrowRightWideFill size={28} />
        </Link>
        <Link
          to="/products"
          className="w-full flex items-center justify-between bg-gray-100 hover:bg-gray-200 text-black font-semibold text-lg rounded-2xl py-4 px-6 shadow transition"
          style={{ minHeight: 56 }}
        >
          <RiArrowLeftWideFill size={28} />
          <span className="mx-auto">Continue shopping</span>
        </Link>
      </div>
    </div>
  );
}
