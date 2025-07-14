import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { AiFillHeart } from "react-icons/ai";
import { apiFetch } from "../lib/api";
import { Link } from "react-router-dom";
import { BASE_URL } from "../lib/api";

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  useEffect(() => {
    async function fetchProducts() {
      const res = await apiFetch("/products");
      const data = await res.json();
      setProducts(data);
    }
    fetchProducts();
  }, []);
  const wishlistProducts = products.filter((p) => wishlist.includes(p._id));

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* دکمه بازگشت به محصولات */}
      <div className="mb-6 flex justify-center md:justify-end">
        <Link
          to="/products"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          ← Zurück zu den Produkten
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistProducts.length === 0 ? (
          <div className="text-center mt-20 col-span-full">
            <AiFillHeart size={40} className="mx-auto text-pink-400" />
            <h2 className="text-xl mt-4">Your wishlist is empty!</h2>
          </div>
        ) : (
          wishlistProducts.map((product) => (
            <div
              key={product._id}
              className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white flex flex-col justify-between"
            >
              <div className="flex items-center gap-3">
                {product.image && (
                  <img
                    src={BASE_URL + product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded mb-2"
                  />
                )}
                <div>
                  <h3 className="text-xl font-semibold">{product.name}</h3>
                  <p className="text-gray-500 text-sm mt-1">
                    {product.description}
                  </p>
                  <p className="mt-2 text-lg font-bold">€{product.price}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => toggleWishlist(product._id)}
                  className="w-full flex items-center justify-center gap-2 text-pink-600 border border-pink-300 rounded py-2 hover:bg-pink-50 transition"
                >
                  <AiFillHeart size={20} />
                  Remove from wishlist
                </button>
                {/* دکمه افزودن به سبد خرید */}
                <button
                  onClick={() => addToCart(product)}
                  className="w-full flex items-center justify-center gap-2 bg-[#264143] text-white rounded py-2 hover:bg-[#221F21] transition"
                >
                  In den Warenkorb
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
