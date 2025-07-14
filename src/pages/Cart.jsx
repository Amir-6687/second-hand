import React from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";
import { BASE_URL } from "../lib/api";

export default function Cart() {
  const {
    items,
    removeFromCart,
    clearCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

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
      <h2 className="text-2xl font-bold mb-4">Dein Warenkorb</h2>
      <ul className="space-y-4">
        {items.map((item) => (
          <li
            key={item._id}
            className="border p-4 rounded flex justify-between items-center"
          >
            <div className="flex items-center gap-3">
              {item.image && (
                <img
                  src={BASE_URL + item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded mb-2"
                />
              )}
              <div>
                <p className="font-semibold">{item.name}</p>
                <p className="text-sm text-gray-600">
                  Preis: €{item.price.toFixed(2)} × {item.quantity || 1}
                </p>
                <div className="flex items-center space-x-2 mt-2">
                  <button
                    onClick={() => decreaseQuantity(item._id)}
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    -
                  </button>
                  <span>{item.quantity || 1}</span>
                  <button
                    onClick={() => increaseQuantity(item._id)}
                    className="px-2 py-1 bg-gray-300 rounded hover:bg-gray-400"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
            <button
              onClick={() => removeFromCart(item._id)}
              className="text-red-600 hover:underline"
            >
              Entfernen
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between items-center border-t pt-4">
        <p className="text-lg font-bold">Gesamt: €{total.toFixed(2)}</p>
        <div className="space-x-2">
          <button
            onClick={clearCart}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Alles löschen
          </button>
          <Link
            to="/checkout"
            className="px-4 py-2 bg-[#264143] text-white rounded hover:bg-[#221F21]"
          >
            Zur Kasse
          </Link>
        </div>
      </div>
    </div>
  );
}
