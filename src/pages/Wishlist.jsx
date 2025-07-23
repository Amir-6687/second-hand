import React, { useEffect, useState } from "react";
import { useWishlist } from "../context/WishlistContext";
import { useCart } from "../context/CartContext";
import { AiFillHeart } from "react-icons/ai";
import { apiFetch, BASE_URL } from "../lib/api";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";

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
    <div className="max-w-4xl mx-auto px-4 pt-6 pb-20">
      {/* Back to Products */}
      <div className="mb-6 flex justify-center md:justify-start">
        <Link
          to="/products"
          className="inline-block px-4 py-2 bg-[#DC2525] text-white rounded-lg font-medium hover:bg-[#b71c1c] transition"
        >
          ← Back to Products
        </Link>
      </div>

      <div className="flex flex-col gap-0">
        {wishlistProducts.length === 0 ? (
          <div className="text-center mt-20 col-span-full">
            <AiFillHeart size={40} className="mx-auto text-pink-400" />
            <h2 className="text-xl mt-4">Your wishlist is empty!</h2>
          </div>
        ) : (
          wishlistProducts.map((product, idx) => (
            <div key={product._id}>
              <div
                className={
                  "sm:bg-white sm:border sm:rounded-xl sm:shadow sm:p-4 " +
                  "flex flex-row gap-4 items-start "
                }
              >
                {/* Image + delivery */}
                <div className="flex flex-col items-center justify-center w-24 flex-shrink-0">
                  <img
                    src={BASE_URL + product.image}
                    alt={product.name}
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <div className="text-xs text-gray-600 mt-2 flex items-center gap-1">
                    📦 <span>Available - 2-3 working days</span>
                  </div>
                  <button
                    onClick={() => toggleWishlist(product._id)}
                    className="flex items-center gap-1 text-gray-600 border border-gray-300 rounded px-4 py-2 mt-2 w-full sm:w-auto justify-center hover:bg-gray-100 transition text-sm"
                  >
                    🗑 Remove
                  </button>
                </div>
                {/* Product Info */}
                <div className="flex-1 flex flex-col justify-between pl-2">
                  {/* Title, description, rating */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <StarRating value={product.avgRating || 0} disabled />
                      <span className="text-xs text-gray-400">
                        ({product.ratings?.length || 0})
                      </span>
                    </div>
                  </div>
                  {/* Buttons + price */}
                  <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end gap-2 mt-4">
                    <div className="flex flex-col items-center sm:items-end">
                      <span className="text-lg font-bold text-[#DC2525] mb-1">
                        €{product.price.toFixed(2)}
                      </span>
                      <button
                        onClick={() => addToCart(product)}
                        className="w-full sm:w-auto px-4 py-2 bg-[#DC2525] text-white rounded hover:bg-[#b71c1c] transition text-sm font-semibold"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Divider for mobile only, not after last item */}
              {idx < wishlistProducts.length - 1 && (
                <div className="block sm:hidden -mx-4 my-4">
                  <hr className="border-t-2 border-gray-200" />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
