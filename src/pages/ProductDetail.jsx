import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import StarRating from "../components/StarRating";

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
    } catch (err) {
      setFeedback(err.message);
    }
  };

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row items-center md:items-start gap-10 py-12">
        {/* مشخصات سمت چپ */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start order-2 md:order-1 md:mt-80">
          <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
            {product.name}
          </h1>
          <p className="text-lg text-gray-700 mb-6 text-center md:text-left">
            {product.description}
          </p>
          <div className="text-2xl font-semibold text-gray-900 mb-8 text-center md:text-left">
            €{product.price}
          </div>
        </div>
        {/* عکس محصول سمت راست */}
        {product.image && (
          <div className="w-full md:w-1/2 flex justify-center md:justify-end order-1 md:order-2">
            <img
              src={BASE_URL + product.image}
              alt={product.name}
              className="w-full max-w-md object-contain rounded-lg shadow"
              style={{ background: "#f8f8f8" }}
            />
          </div>
        )}
      </div>
      {/* Average and user rating at the bottom center */}
      <div className="flex flex-col items-center mt-2 mb-8">
        <div className="mb-2 flex flex-col items-center">
          <span className="font-semibold mb-1">Average rating:</span>
          <StarRating
            value={avgRating || 0}
            disabled
            onChange={() => {}}
            size={20}
          />
          <span className="text-xs text-gray-500 mt-1">
            {avgRating ? `${avgRating} / 5` : "No ratings yet"}
          </span>
        </div>
        <div className="mb-2 flex flex-col items-center">
          <span className="font-semibold mb-1">Your rating:</span>
          <StarRating
            value={userRating}
            onChange={hasBought ? handleRate : () => {}}
            disabled={!hasBought}
            size={20}
          />
          {!hasBought && (
            <span className="ml-2 text-xs text-gray-400">
              (You can only rate products you have purchased)
            </span>
          )}
        </div>
        {feedback && (
          <div className="mt-2 text-sm text-blue-600">{feedback}</div>
        )}
      </div>
    </div>
  );
}
