import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { BASE_URL } from "../lib/api";
import {
  FaFacebookF,
  FaPinterestP,
  FaLinkedinIn,
  FaTelegramPlane,
  FaWhatsapp,
  FaCheckCircle,
} from "react-icons/fa";
import { PiXLogo } from "react-icons/pi";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Tooltip = ({ show, children }) => (
  <div
    className={`pointer-events-none absolute left-10 top-2 z-20 px-2 py-1 rounded text-xs text-white bg-black transition-opacity duration-200 ${
      show ? "opacity-100" : "opacity-0"
    }`}
    style={{ whiteSpace: "nowrap" }}
  >
    {children}
  </div>
);

const SOCIALS = [
  {
    name: "Facebook",
    icon: <FaFacebookF size={20} />,
    url: (link, name) =>
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        link
      )}&quote=${encodeURIComponent(name)}`,
  },
  {
    name: "X",
    icon: <PiXLogo size={20} />,
    url: (link, name) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        link
      )}&text=${encodeURIComponent(name)}`,
  },
  {
    name: "Pinterest",
    icon: <FaPinterestP size={20} />,
    url: (link, name) =>
      `https://pinterest.com/pin/create/button/?url=${encodeURIComponent(
        link
      )}&description=${encodeURIComponent(name)}`,
  },
  {
    name: "LinkedIn",
    icon: <FaLinkedinIn size={20} />,
    url: (link, name) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        link
      )}`,
  },
  {
    name: "Telegram",
    icon: <FaTelegramPlane size={20} />,
    url: (link, name) =>
      `https://t.me/share/url?url=${encodeURIComponent(
        link
      )}&text=${encodeURIComponent(name)}`,
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp size={20} />,
    url: (link, name) =>
      `https://wa.me/?text=${encodeURIComponent(name + " " + link)}`,
  },
];

const QuickViewModal = ({ product, open, onClose }) => {
  const { addToCart } = useCart();
  const [selectedSize, setSelectedSize] = useState("M");
  const [hoveredSize, setHoveredSize] = useState(null);
  const productLink = window.location.origin + "/products/" + product._id;
  const sizes = ["S", "M", "L", "XL"];

  // تنظیمات اسلایدر
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: true,
    cssEase: "linear",
    arrows: true,
    adaptiveHeight: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  // کامپوننت‌های سفارشی برای فلش‌ها
  function SampleNextArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, right: "-25px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  function SamplePrevArrow(props) {
    const { className, style, onClick } = props;
    return (
      <div
        className={className}
        style={{ ...style, left: "-25px", zIndex: 1 }}
        onClick={onClick}
      />
    );
  }

  if (!open || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div
        className="bg-white rounded-lg shadow-lg max-w-3xl w-full relative p-8 flex flex-col md:flex-row gap-10 min-h-[480px] max-h-[90vh] md:max-h-[90vh] overflow-y-auto md:overflow-visible"
        style={{
          padding: window.innerWidth <= 768 ? 16 : undefined,
          minHeight: window.innerWidth <= 768 ? 0 : undefined,
          maxHeight: window.innerWidth <= 768 ? "80vh" : undefined,
        }}
      >
        <button
          className="absolute top-2 right-2 text-black hover:text-gray-700 rounded-full w-8 h-8 flex items-center justify-center text-3xl font-thin tracking-tighter z-50"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
        <div className="flex-1 flex items-center justify-center">
          {product.images && product.images.length > 0 ? (
            <div className="w-full max-w-md">
              <Slider {...sliderSettings}>
                {product.images.map((image, index) => (
                  <div key={index} className="px-2 outline-none">
                    <img
                      src={BASE_URL + image}
                      alt={`${product.name} - ${index + 1}`}
                      className="w-full h-auto max-h-96 object-contain rounded mx-auto"
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <img
              src={BASE_URL + product.image}
              alt={product.name}
              className="w-full max-w-md object-contain rounded max-h-96"
            />
          )}
        </div>
        <div className="flex-1 flex flex-col justify-start">
          <h2 className="text-3xl font-bold mb-2">{product.name}</h2>
          <div className="text-pink-500 text-2xl font-semibold mb-4">
            ${product.price.toLocaleString()}
          </div>

          {/* Size selector */}
          <div className="mb-6">
            <div className="font-semibold mb-2">Size:</div>
            <div className="flex gap-6">
              {sizes.map((size) => (
                <button
                  key={size}
                  className="relative px-2 py-1 text-lg font-medium text-gray-800 focus:outline-none bg-transparent"
                  style={{ minWidth: 36 }}
                  onMouseEnter={() => setHoveredSize(size)}
                  onMouseLeave={() => setHoveredSize(null)}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                  <span
                    className={`absolute left-0 right-0 -bottom-1 h-[2px] rounded transition-all duration-200 ${
                      selectedSize === size
                        ? "bg-black w-full opacity-100"
                        : hoveredSize === size
                        ? "bg-black w-2/3 opacity-60"
                        : "bg-transparent w-0 opacity-0"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <button
            className="mt-2 mb-8 bg-pink-500 text-white px-6 py-2 rounded flex items-center gap-2 justify-center hover:bg-pink-600 transition text-lg font-semibold"
            onClick={() => {
              addToCart({ ...product, selectedSize });
              onClose();
              setTimeout(() => alert("Added to cart!"), 200);
            }}
          >
            <AiOutlineShoppingCart size={22} /> Add to Cart
          </button>

          <div className="mt-auto pt-4 border-t flex flex-col gap-2 pb-2 md:pb-0">
            <div className="font-medium text-gray-700 mb-1">Share:</div>
            <div className="flex gap-4 items-center flex-wrap">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url(productLink, product.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-pink-500 transition"
                  title={"Share on " + s.name}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { wishlist, toggleWishlist } = useWishlist();
  const [hovered, setHovered] = useState(false);
  const [showSearchTip, setShowSearchTip] = useState(false);
  const [showHeartTip, setShowHeartTip] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [blurHovered, setBlurHovered] = useState(false);
  const [addedEffect, setAddedEffect] = useState(false);

  const mainImg =
    product.images && product.images.length > 0
      ? product.images[0]
      : product.image;
  const secondImg =
    product.images && product.images.length > 1 ? product.images[1] : mainImg;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setAddedEffect(true);
    setTimeout(() => setAddedEffect(false), 1500);
  };

  return (
    <div
      className="relative bg-white rounded-2xl overflow-hidden shadow group transition-all duration-300 border hover:shadow-xl"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setShowSearchTip(false);
        setShowHeartTip(false);
        setBlurHovered(false);
      }}
    >
      {/* Feedback effect overlay */}
      {addedEffect && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-white/70 animate-fade-in-out">
          <FaCheckCircle className="text-green-500" size={48} />
          <span className="mt-2 text-green-700 font-bold text-lg animate-pop">
            Added to cart!
          </span>
        </div>
      )}

      {/* Image with hover effect */}
      <Link to={`/products/${product._id}`} className="block">
        <div className="relative w-full aspect-[4/5] overflow-hidden">
          <img
            src={BASE_URL + (hovered ? secondImg : mainImg)}
            alt={product.name}
            className={`w-full h-full object-contain transition-transform duration-500 ${
              hovered ? "scale-105" : "scale-100"
            }`}
            draggable={false}
          />

          {/* Left icons */}
          <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
            <div className="relative">
              <button
                className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:scale-110 transition"
                onMouseEnter={() => setShowSearchTip(true)}
                onMouseLeave={() => setShowSearchTip(false)}
                onClick={(e) => {
                  e.preventDefault();
                  setShowModal(true);
                }}
                tabIndex={-1}
              >
                <AiOutlineSearch size={22} className="text-gray-700" />
              </button>
              <Tooltip show={showSearchTip}>Quick View</Tooltip>
            </div>
            <div className="relative">
              <button
                className="bg-white rounded-full w-9 h-9 flex items-center justify-center shadow hover:scale-110 transition"
                onMouseEnter={() => setShowHeartTip(true)}
                onMouseLeave={() => setShowHeartTip(false)}
                onClick={(e) => {
                  e.preventDefault();
                  toggleWishlist(product._id);
                }}
                tabIndex={-1}
              >
                {wishlist.includes(product._id) ? (
                  <AiFillHeart size={22} className="text-pink-500" />
                ) : (
                  <AiOutlineHeart size={22} className="text-gray-700" />
                )}
              </button>
              <Tooltip show={showHeartTip}>Add to Wishlist</Tooltip>
            </div>
          </div>

          {/* Blur overlay bottom */}
          <div
            className={`absolute bottom-0 left-0 w-full h-12 flex items-center justify-center transition-all duration-300 ${
              hovered
                ? "backdrop-blur-md bg-white/60"
                : "backdrop-blur-sm bg-white/40"
            }`}
            onMouseEnter={() => setBlurHovered(true)}
            onMouseLeave={() => setBlurHovered(false)}
          >
            <button
              className="w-full h-full flex items-center justify-center text-lg font-semibold text-gray-800 select-none focus:outline-none"
              tabIndex={-1}
              onClick={handleAddToCart}
            >
              {blurHovered ? (
                <AiOutlineShoppingCart size={26} className="text-pink-400" />
              ) : (
                <span>Select</span>
              )}
            </button>
          </div>
        </div>
      </Link>

      {/* Product info */}
      <div className="flex flex-col items-center mt-3 mb-2">
        <div className="flex items-center gap-1 mb-1">
          {/* color or other features here */}
        </div>
        <div className="text-base font-medium text-gray-900 text-center truncate w-full max-w-[90%]">
          {product.name}
        </div>
        <div className="text-pink-400 text-lg font-bold mt-1">
          ${product.price.toLocaleString()}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewModal
        product={product}
        open={showModal}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default ProductCard;

// import React, { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { apiFetch } from "../lib/api";
// import { BASE_URL } from "../lib/api";
// import StarRating from "../components/StarRating";
// import Slider from "react-slick";
// import "slick-carousel/slick/slick.css";
// import "slick-carousel/slick/slick-theme.css";
// import { FiZoomIn, FiZoomOut } from "react-icons/fi";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);
//   const [userRating, setUserRating] = useState(0);
//   const [avgRating, setAvgRating] = useState(null);
//   const [hasBought, setHasBought] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [feedback, setFeedback] = useState("");
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const [isZoomed, setIsZoomed] = useState(false);
//   const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
//   const [showZoomModal, setShowZoomModal] = useState(false);
//   const [modalImage, setModalImage] = useState("");
//   const mainSliderRef = useRef(null);
//   const zoomImageRef = useRef(null);

//   const isMobile = () => window.matchMedia("(max-width: 768px)").matches;

//   const mainSliderSettings = {
//     dots: false,
//     infinite: true,
//     speed: 300,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     fade: true,
//     cssEase: 'linear',
//     beforeChange: (current, next) => setCurrentSlide(next)
//   };

//   useEffect(() => {
//     async function fetchProduct() {
//       setLoading(true);
//       setFeedback("");
//       try {
//         const token = localStorage.getItem("token");
//         const res = await apiFetch(`/products/${id}/details`, {
//           headers: token ? { Authorization: `Bearer ${token}` } : {},
//         });
//         const data = await res.json();
//         if (!res.ok) throw new Error(data.error || "Failed to load product");

//         // ادغام اطلاعات اصلی و جزئیات
//         const mergedProduct = {
//           ...data,
//           dimensions: data.dimensions || {},
//           details: data.details || {}
//         };

//         setProduct(mergedProduct);
//         setAvgRating(Number(data.avgRating) || null);
//         setUserRating(data.userRating || 0);
//         setHasBought(data.hasBought || false);
//       } catch (err) {
//         setFeedback(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchProduct();
//   }, [id]);

//   const handleRate = async (rating) => {
//     setFeedback("");
//     try {
//       const token = localStorage.getItem("token");
//       const res = await apiFetch(`/products/${id}/rate`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({ rating }),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.error || "Failed to submit rating");
//       setUserRating(rating);
//       setFeedback("Thank you for your rating!");
//     } catch (err) {
//       setFeedback(err.message);
//     }
//   };

//   const handleThumbnailClick = (index) => {
//     setCurrentSlide(index);
//     if (mainSliderRef.current) {
//       mainSliderRef.current.slickGoTo(index);
//     }
//   };

//   const handleImageClick = (image) => {
//     if (isMobile()) return;
//     setModalImage(BASE_URL + image);
//     setShowZoomModal(true);
//     setIsZoomed(false);
//   };

//   const handleZoomToggle = () => {
//     setIsZoomed(!isZoomed);
//   };

//   const handleMouseMove = (e) => {
//     if (!isZoomed || !zoomImageRef.current) return;

//     const { left, top, width, height } = zoomImageRef.current.getBoundingClientRect();
//     const x = ((e.clientX - left) / width) * 100;
//     const y = ((e.clientY - top) / height) * 100;
//     setZoomPosition({ x, y });
//   };

//   if (loading) return <div className="text-center py-20">Loading...</div>;
//   if (!product)
//     return <div className="text-center py-20">Product not found.</div>;

//   const images = product.images && product.images.length > 0
//     ? product.images
//     : product.image
//       ? [product.image]
//       : [];

//   return (
//     <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">
//       <div className="max-w-6xl w-full flex flex-col md:flex-row items-center md:items-start gap-10 py-12">
//         {/* مشخصات سمت چپ */}
//         <div className="w-full md:w-1/2 flex flex-col justify-center items-center md:items-start order-2 md:order-1">
//           <h1 className="text-3xl font-bold mb-4 text-center md:text-left">
//             {product.name}
//           </h1>
//           <p className="text-lg text-gray-700 mb-6 text-center md:text-left">
//             {product.description}
//           </p>
//           <div className="text-2xl font-semibold text-gray-900 mb-4 text-center md:text-left">
//             €{product.price}
//           </div>

//           {/* اطلاعات جدید */}
//           <div className="w-full space-y-3 mt-4">
//             {product.condition && (
//               <div>
//                 <span className="font-semibold">Condition:</span>
//                 <span className="ml-2">{product.condition}</span>
//               </div>
//             )}

//             {product.dimensions && (
//               <div>
//                 <span className="font-semibold">Dimensions:</span>
//                 {product.dimensions.width && (
//                   <span className="ml-2">Width: {product.dimensions.width}cm</span>
//                 )}
//                 {product.dimensions.depth && (
//                   <span className="ml-2">Depth: {product.dimensions.depth}cm</span>
//                 )}
//                 {product.dimensions.height && (
//                   <span className="ml-2">Height: {product.dimensions.height}cm</span>
//                 )}
//               </div>
//             )}

//             {product.details && (
//               <div className="space-y-2">
//                 <div className="font-semibold">Details:</div>
//                 {product.details.brand && (
//                   <div>
//                     <span className="font-semibold">Brand:</span>
//                     <span className="ml-2">{product.details.brand}</span>
//                   </div>
//                 )}
//                 {product.details.type && (
//                   <div>
//                     <span className="font-semibold">Type:</span>
//                     <span className="ml-2">{product.details.type}</span>
//                   </div>
//                 )}
//                 {product.details.material && (
//                   <div>
//                     <span className="font-semibold">Material:</span>
//                     <span className="ml-2">{product.details.material}</span>
//                   </div>
//                 )}
//                 {product.details.color && (
//                   <div>
//                     <span className="font-semibold">Color:</span>
//                     <span className="ml-2">{product.details.color}</span>
//                   </div>
//                 )}
//                 {product.details.pattern && (
//                   <div>
//                     <span className="font-semibold">Pattern:</span>
//                     <span className="ml-2">{product.details.pattern}</span>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* بخش تصاویر سمت راست */}
//         <div className="w-full md:w-1/2 flex flex-row-reverse gap-6 order-1 md:order-2">
//           {/* اسلایدر اصلی */}
//           <div className="w-4/5 relative">
//             <Slider
//               {...mainSliderSettings}
//               initialSlide={currentSlide}
//               ref={mainSliderRef}
//             >
//               {images.map((image, index) => (
//                 <div key={index} className="relative">
//                   <img
//                     src={BASE_URL + image}
//                     alt={`${product.name} - ${index + 1}`}
//                     className="w-full h-auto max-h-[500px] object-contain rounded-lg shadow"
//                     style={{ background: "#f8f8f8" }}
//                     onClick={() => handleImageClick(image)}
//                   />
//                   {!isMobile() && (
//                     <div
//                       className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200 cursor-zoom-in"
//                       onClick={() => handleImageClick(image)}
//                     >
//                       <div className="bg-black bg-opacity-50 rounded-full p-3">
//                         <FiZoomIn className="text-white text-2xl" />
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </Slider>
//           </div>

//           {/* گالری تصاویر عمودی */}
//           <div className="w-1/5 flex flex-col gap-4 overflow-y-auto max-h-[500px] pr-2">
//             {images.map((image, index) => (
//               <div
//                 key={index}
//                 className={`cursor-pointer transition-all duration-200 ${
//                   index === currentSlide
//                     ? "border-2 border-gray-900"
//                     : "border border-gray-300"
//                 } rounded-lg overflow-hidden`}
//                 onClick={() => handleThumbnailClick(index)}
//               >
//                 <img
//                   src={BASE_URL + image}
//                   alt={`Thumbnail ${index + 1}`}
//                   className="w-full h-full object-cover aspect-square"
//                 />
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>

//       {/* بخش رتبه‌بندی */}
//       <div className="flex flex-col items-center mt-2 mb-8">
//         <div className="mb-2 flex flex-col items-center">
//           <span className="font-semibold mb-1">Average rating:</span>
//           <StarRating
//             value={avgRating || 0}
//             disabled
//             onChange={() => {}}
//             size={20}
//           />
//           <span className="text-xs text-gray-500 mt-1">
//             {avgRating ? `${avgRating} / 5` : "No ratings yet"}
//           </span>
//         </div>
//         <div className="mb-2 flex flex-col items-center">
//           <span className="font-semibold mb-1">Your rating:</span>
//           <StarRating
//             value={userRating}
//             onChange={hasBought ? handleRate : () => {}}
//             disabled={!hasBought}
//             size={20}
//           />
//           {!hasBought && (
//             <span className="ml-2 text-xs text-gray-400">
//               (You can only rate products you have purchased)
//             </span>
//           )}
//         </div>
//         {feedback && (
//           <div className="mt-2 text-sm text-blue-600">{feedback}</div>
//         )}
//       </div>

//       {/* مودال بزرگنمایی تصویر (فقط برای دسکتاپ) */}
//       {showZoomModal && !isMobile() && (
//         <div
//           className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
//           onClick={() => setShowZoomModal(false)}
//         >
//           <div
//             className="relative max-w-full max-h-full"
//             onClick={(e) => e.stopPropagation()}
//           >
//             <img
//               ref={zoomImageRef}
//               src={modalImage}
//               alt="Zoomed product"
//               className={`max-w-[90vw] max-h-[90vh] object-contain transition-transform duration-200 ${
//                 isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
//               }`}
//               style={{
//                 transform: isZoomed
//                   ? `scale(2) translate(${-zoomPosition.x + 50}%, ${-zoomPosition.y + 50}%)`
//                   : 'none'
//               }}
//               onClick={handleZoomToggle}
//               onMouseMove={handleMouseMove}
//             />
//             <button
//               className="absolute top-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
//               onClick={() => setShowZoomModal(false)}
//             >
//               &times;
//             </button>
//             <button
//               className="absolute bottom-4 right-4 bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg hover:bg-gray-100 transition"
//               onClick={handleZoomToggle}
//             >
//               {isZoomed ? <FiZoomOut size={20} /> : <FiZoomIn size={20} />}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
