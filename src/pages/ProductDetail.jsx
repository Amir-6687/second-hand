import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { apiFetch } from "../lib/api";
import { BASE_URL } from "../lib/api";
import StarRating from "../components/StarRating";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FiZoomIn, FiZoomOut } from "react-icons/fi";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [avgRating, setAvgRating] = useState(null);
  const [hasBought, setHasBought] = useState(false);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [showZoomModal, setShowZoomModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [showFullDesc, setShowFullDesc] = useState(false);
  const mainSliderRef = useRef(null);
  const zoomImageRef = useRef(null);

  // تابع تشخیص دستگاه موبایل
  const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

  // تنظیمات اسلایدر اصلی
  const mainSliderSettings = {
    dots: false,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: "linear",
    beforeChange: (current, next) => setCurrentSlide(next),
  };

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

  const handleThumbnailClick = (index) => {
    setCurrentSlide(index);
    if (mainSliderRef.current) {
      mainSliderRef.current.slickGoTo(index);
    }
  };

  const handleImageClick = (image) => {
    if (isMobile()) return; // غیرفعال برای موبایل
    setModalImage(BASE_URL + image);
    setShowZoomModal(true);
    setIsZoomed(false);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handleMouseMove = (e) => {
    if (!isZoomed || !zoomImageRef.current) return;

    const { left, top, width, height } =
      zoomImageRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  const truncatedDesc =
    product?.description?.length > 70
      ? product.description.substring(0, 70) + "..."
      : product?.description;

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (!product)
    return <div className="text-center py-20">Product not found.</div>;

  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.image
      ? [product.image]
      : [];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
      <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10 py-12">
        {/* مشخصات سمت چپ */}
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start order-2 md:order-1">
          <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
            {product.name}
          </h1>
          {product.description && (
            <div className="text-lg text-gray-700 mb-6 text-center md:text-left">
              {showFullDesc ? product.description : truncatedDesc}
              {product.description?.length > 70 && (
                <button
                  className="text-pink-500 ml-2 hover:underline font-medium"
                  onClick={() => setShowFullDesc(!showFullDesc)}
                >
                  {showFullDesc ? "less" : "more"}
                </button>
              )}
            </div>
          )}
          <div className="text-2xl font-semibold text-gray-900 mb-8 text-center md:text-left">
            €{product.price}
          </div>

          {/* جزئیات محصول */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 w-full max-w-lg mx-auto md:mx-0">
            <div className="mb-2">
              <span className="font-bold">Zustand:</span>{" "}
              <span>{product.zustand || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Size (cm):</span>{" "}
              <span>
                {product.width || "-"} x {product.depth || "-"} x{" "}
                {product.height || "-"}
              </span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Brand:</span>{" "}
              <span>{product.brand || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Model:</span>{" "}
              <span>{product.model || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Color:</span>{" "}
              <span>{product.color || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Material:</span>{" "}
              <span>{product.material || "-"}</span>
            </div>
            <div className="mb-2">
              <span className="font-bold">Pattern:</span>{" "}
              <span>{product.pattern || "-"}</span>
            </div>
          </div>
        </div>

        {/* بخش تصاویر سمت راست */}
        <div className="w-full md:w-1/2 flex flex-row-reverse gap-6 order-1 md:order-2">
          {/* اسلایدر اصلی */}
          <div className="w-4/5 relative">
            <Slider
              {...mainSliderSettings}
              initialSlide={currentSlide}
              ref={mainSliderRef}
            >
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={BASE_URL + image}
                    alt={`${product.name} - ${index + 1}`}
                    className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow"
                    style={{ background: "#f8f8f8" }}
                    onClick={() => handleImageClick(image)}
                  />
                  {!isMobile() && (
                    <div
                      className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-zoom-in"
                      onClick={() => handleImageClick(image)}
                    >
                      <div className="bg-black bg-opacity-50 rounded-full p-3">
                        <FiZoomIn className="text-white text-2xl" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>

          {/* گالری تصاویر عمودی */}
          <div className="w-1/5 flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
            {images.map((image, index) => (
              <div
                key={index}
                className={`cursor-pointer transition-all duration-200 ${
                  index === currentSlide
                    ? "border-2 border-gray-900"
                    : "border border-gray-300"
                } rounded-lg overflow-hidden`}
                onClick={() => handleThumbnailClick(index)}
              >
                <img
                  src={BASE_URL + image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover aspect-square"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* بخش رتبه‌بندی */}
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

      {/* مودال بزرگنمایی تصویر (فقط برای دسکتاپ) */}
      {showZoomModal && !isMobile() && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
          onClick={() => setShowZoomModal(false)}
        >
          <div
            className="relative max-w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              ref={zoomImageRef}
              src={modalImage}
              alt="Zoomed product"
              className={`max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ${
                isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
              style={{
                transform: isZoomed
                  ? `scale(2) translate(${-zoomPosition.x + 50}%, ${
                      -zoomPosition.y + 50
                    }%)`
                  : "none",
              }}
              onClick={handleZoomToggle}
              onMouseMove={handleMouseMove}
            />
            <button
              className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
              onClick={() => setShowZoomModal(false)}
            >
              &times;
            </button>
            <button
              className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
              onClick={handleZoomToggle}
            >
              {isZoomed ? <FiZoomOut size={20} /> : <FiZoomIn size={20} />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
