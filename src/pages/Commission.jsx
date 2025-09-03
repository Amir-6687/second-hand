import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../lib/api";

export default function Commission() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${BASE_URL}/commission`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching commission products:", error);
    } finally {
      setLoading(false);
    }
  };

  const uniquePartners = [...new Set(products.map((p) => p.partnerName))];
  const filteredProducts =
    selectedPartner === "all"
      ? products
      : products.filter((p) => p.partnerName === selectedPartner);

  const handlePartnerSelect = (partner) => {
    setSelectedPartner(partner);
    setIsDropdownOpen(false);
  };

  const getSelectedPartnerInfo = () => {
    if (selectedPartner === "all") {
      return {
        name: "Alle Partner",
        count: products.length,
        logo: null,
      };
    }

    const partnerProducts = products.filter(
      (p) => p.partnerName === selectedPartner
    );
    return {
      name: selectedPartner,
      count: partnerProducts.length,
      logo: partnerProducts[0]?.partnerLogo,
    };
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const selectedInfo = getSelectedPartnerInfo();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Kommissions-Neuware
        </h1>
        <p className="text-lg text-gray-600">
          Entdecken Sie neue Produkte unserer Partner mit attraktiven
          Kommissionspreisen
        </p>
      </div>

      {/* Partner Dropdown */}
      <div className="mb-8 flex justify-center">
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 shadow-sm hover:shadow-md transition-shadow duration-200 min-w-[200px]"
          >
            {/* Partner Logo or Icon */}
            <div className="flex items-center gap-2">
              {selectedInfo.logo ? (
                <img
                  src={BASE_URL + selectedInfo.logo}
                  alt={selectedInfo.name}
                  className="w-6 h-6 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg">
                  {selectedPartner === "all" ? "🏪" : "🏢"}
                </span>
              )}
              <span className="font-medium text-gray-900">
                {selectedInfo.name}
              </span>
            </div>

            {/* Count Badge */}
            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-sm font-medium">
              {selectedInfo.count}
            </span>

            {/* Dropdown Arrow */}
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${
                isDropdownOpen ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              {/* All Partners Option */}
              <button
                onClick={() => handlePartnerSelect("all")}
                className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                  selectedPartner === "all"
                    ? "bg-pink-50 text-pink-600"
                    : "text-gray-900"
                }`}
              >
                <span className="text-lg">🏪</span>
                <div className="flex-1">
                  <div className="font-medium">Alle Partner</div>
                  <div className="text-sm text-gray-500">
                    {products.length} Produkte
                  </div>
                </div>
                {selectedPartner === "all" && (
                  <svg
                    className="w-4 h-4 text-pink-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </button>

              {/* Divider */}
              <div className="border-t border-gray-100"></div>

              {/* Individual Partners */}
              {uniquePartners.map((partner) => {
                const partnerProducts = products.filter(
                  (p) => p.partnerName === partner
                );
                const partnerLogo = partnerProducts[0]?.partnerLogo;
                const isSelected = selectedPartner === partner;

                return (
                  <button
                    key={partner}
                    onClick={() => handlePartnerSelect(partner)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors duration-150 ${
                      isSelected ? "bg-pink-50 text-pink-600" : "text-gray-900"
                    }`}
                  >
                    {partnerLogo ? (
                      <img
                        src={BASE_URL + partnerLogo}
                        alt={partner}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-lg">🏢</span>
                    )}
                    <div className="flex-1">
                      <div className="font-medium">{partner}</div>
                      <div className="text-sm text-gray-500">
                        {partnerProducts.length} Produkte
                      </div>
                    </div>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-pink-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Tab Content Indicator */}
      <div className="mb-6 text-center">
        <p className="text-sm text-gray-600">
          {selectedPartner === "all"
            ? `Zeige alle ${products.length} Produkte von ${uniquePartners.length} Partnern`
            : `Zeige ${filteredProducts.length} Produkte von ${selectedPartner}`}
        </p>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => navigate(`/commission/${product._id}`)}
          >
            {/* Product Image */}
            <div className="aspect-square overflow-hidden relative">
              <img
                src={
                  product.images && product.images.length > 0
                    ? BASE_URL + product.images[0]
                    : "/placeholder-image.jpg"
                }
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Partner Badge */}
              <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                {product.partnerLogo && (
                  <img
                    src={BASE_URL + product.partnerLogo}
                    alt={product.partnerName}
                    className="w-4 h-4 rounded-full"
                  />
                )}
                <span className="text-xs font-medium text-gray-700">
                  {product.partnerName}
                </span>
              </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Price */}
              <div className="text-lg font-bold text-pink-600 mb-2">
                {product.isDiscounted && product.originalPrice ? (
                  <div className="flex flex-col gap-1">
                    <span className="line-through text-red-500 text-sm">
                      €{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-pink-600">
                      €{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium w-fit">
                      {product.discountLabel || "Last Chance"}
                    </span>
                  </div>
                ) : (
                  <span>€{product.price.toLocaleString()}</span>
                )}
              </div>

              {/* Commission Rate */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Kommission: {product.commissionRate}%
                </div>
                <div className="text-xs text-gray-400">
                  {product.category && `• ${product.category}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">🛍️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Keine Produkte gefunden
          </h3>
          <p className="text-gray-500">
            {selectedPartner === "all"
              ? "Es sind derzeit keine Kommissionsprodukte verfügbar."
              : `Keine Produkte für ${selectedPartner} gefunden.`}
          </p>
        </div>
      )}
    </div>
  );
}
