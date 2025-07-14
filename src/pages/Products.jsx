import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../context/WishlistContext";
import { apiFetch } from "../lib/api";
import StarRating from "../components/StarRating";
import { Link } from "react-router-dom";

// BASE_URL را از lib/api.js ایمپورت کن
import { BASE_URL } from "../lib/api";

export default function Products() {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRatings, setUserRatings] = useState({});

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setError("");
      try {
        const res = await apiFetch("/products");
        if (!res.ok) throw new Error("Fehler beim Laden der Produkte");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const handleAdd = (product) => {
    const item = { ...product, quantity: 1 };
    addToCart(item);
  };

  const handleRate = async (productId, rating) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(BASE_URL + `/products/${productId}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error submitting rating");
      setUserRatings((prev) => ({ ...prev, [productId]: rating }));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {loading && <p>Lade Produkte...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {!loading &&
        !error &&
        products.map((product) => (
          <div
            key={product._id}
            className="border rounded-lg p-4 shadow hover:shadow-lg transition bg-white"
          >
            <Link to={`/products/${product._id}`}>
              {product.image && (
                <img
                  src={BASE_URL + product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover mb-2 rounded"
                />
              )}
              <h3 className="text-xl font-semibold">{product.name}</h3>
            </Link>
            <p className="text-gray-500 text-sm mt-1">{product.description}</p>
            <p className="mt-2 text-lg font-bold">€{product.price}</p>
            <button
              onClick={() => handleAdd(product)}
              className="mt-4 w-full bg-[#264143] text-white py-2 px-4 rounded hover:bg-[#221F21] transition"
            >
              In den Warenkorb
            </button>
            <button
              onClick={() => toggleWishlist(product._id)}
              className={`mt-2 w-full flex items-center justify-center gap-2 ${
                wishlist.includes(product._id)
                  ? "text-pink-600"
                  : "text-gray-400"
              } border border-pink-300 rounded py-2 hover:bg-pink-50 transition`}
            >
              {wishlist.includes(product._id) ? (
                <AiFillHeart size={20} />
              ) : (
                <AiOutlineHeart size={20} />
              )}
              {wishlist.includes(product._id)
                ? "In wishlist"
                : "Add to wishlist"}
            </button>
            <div className="flex items-center mb-1">
              <StarRating
                value={userRatings[product._id] || 0}
                onChange={(star) => handleRate(product._id, star)}
                disabled={false}
              />
              <span className="ml-2 text-xs text-gray-500">
                {product.avgRating ? `${product.avgRating} / 5` : "No rating"}
              </span>
            </div>
          </div>
        ))}
    </div>
  );
}
