import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../lib/api";
import { useWishlist } from "../context/WishlistContext";

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

      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item._id}
            className="relative border p-4 rounded flex gap-4 items-start min-h-[160px]"
          >
            {/* Remove button */}
            <button
              onClick={() => removeFromCart(item._id)}
              className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-6 h-6 flex items-center justify-center text-sm"
              aria-label="Remove from cart"
            >
              ×
            </button>

            <div className="flex flex-col items-start gap-2 flex-shrink-0">
              {item.images && item.images.length > 0 ? (
                <img
                  src={BASE_URL + item.images[0]}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mb-1"
                />
              ) : item.image ? (
                <img
                  src={BASE_URL + item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded mb-1"
                />
              ) : null}

              {/* Quantity Selector */}
              <div className="flex flex-col items-start w-full">
                <label
                  className="text-xs text-gray-500 mb-1"
                  htmlFor={`qty-${item._id}`}
                >
                  Quantity
                </label>
                <select
                  id={`qty-${item._id}`}
                  className="border rounded-lg px-4 py-2 text-base font-semibold focus:outline-pink-400 w-20 text-center appearance-none shadow-sm"
                  value={item.quantity || 1}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    const diff = val - (item.quantity || 1);
                    if (diff > 0) {
                      for (let i = 0; i < diff; i++) increaseQuantity(item._id);
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
              </div>
            </div>

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
              <span className="absolute bottom-4 right-4 text-lg font-bold text-gray-800">
                €{item.price.toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <p className="text-lg font-bold">Total: €{total.toFixed(2)}</p>
        <div className="space-x-2">
          <Link
            to="/checkout"
            className="px-4 py-2 bg-[#264143] text-white rounded hover:bg-[#221F21]"
          >
            Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
