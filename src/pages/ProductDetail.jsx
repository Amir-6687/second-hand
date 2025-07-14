import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import StarRating from "../components/StarRating";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function fetchProduct() {
      setLoading(true);
      setFeedback("");
      try {
        const token = localStorage.getItem("token");
        const res = await apiFetch(`/products/${id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to load product");
        setProduct(data);
        setAvgRating(Number(data.avgRating) || null);
        setUserRating(data.userRating || 0);
        setHasBought(data.hasBought || false);
      } catch (err) {
        setFeedback(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleRate = async (rating) => {
    setFeedback("");
    try {
      const token = localStorage.getItem("token");
      const res = await apiFetch(`/products/${id}/rate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ rating }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit rating");
      setUserRating(rating);
      setFeedback("Thank you for your rating!");
      // (اختیاری) می‌توانی دوباره محصول را fetch کنی تا avgRating آپدیت شود
    } catch (err) {
      setFeedback(err.message);
    }
  };

  if (loading) return <div>Loading product...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      {product.image && (
        <img
          src={BASE_URL + product.image}
          alt={product.name}
          className="w-full h-64 object-cover mb-4 rounded"
        />
      )}
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-600 mb-4">{product.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Average rating: </span>
        <StarRating value={avgRating || 0} disabled onChange={() => {}} />
        <span className="ml-2 text-sm text-gray-500">
          {avgRating ? `${avgRating} / 5` : "No ratings yet"}
        </span>
      </div>
      <div className="mb-4">
        <span className="font-semibold">Your rating: </span>
        <StarRating
          value={userRating}
          onChange={hasBought ? handleRate : () => {}}
          disabled={!hasBought}
        />
        {!hasBought && (
          <span className="ml-2 text-xs text-gray-400">
            (You can only rate products you have purchased)
          </span>
        )}
      </div>
      {feedback && <div className="mt-2 text-sm text-blue-600">{feedback}</div>}
    </div>
  );
}
