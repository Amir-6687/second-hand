import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";
import { useWishlist } from "../context/WishlistContext";
import { apiFetch } from "../lib/api";
import StarRating from "../components/StarRating";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";

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
    <div className="min-h-screen bg-white text-gray-900">
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 mt-10 mb-16 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading && <p>Lade Produkte...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {!loading &&
          !error &&
          products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
      </div>
    </div>
  );
}
