import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../lib/api";

export default function Commission() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPartner, setSelectedPartner] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
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

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

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

      {/* Partner Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setSelectedPartner("all")}
            className={`px-4 py-2 rounded-full ${
              selectedPartner === "all"
                ? "bg-pink-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Alle Partner
          </button>
          {uniquePartners.map((partner) => (
            <button
              key={partner}
              onClick={() => setSelectedPartner(partner)}
              className={`px-4 py-2 rounded-full ${
                selectedPartner === partner
                  ? "bg-pink-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              {partner}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/commission/${product._id}`)}
          >
            {/* Product Image */}
            <div className="aspect-square overflow-hidden">
              <img
                src={
                  product.images && product.images.length > 0
                    ? BASE_URL + product.images[0]
                    : "/placeholder-image.jpg"
                }
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            </div>

            {/* Product Info */}
            <div className="p-4">
              {/* Partner Info */}
              <div className="flex items-center gap-2 mb-2">
                {product.partnerLogo && (
                  <img
                    src={BASE_URL + product.partnerLogo}
                    alt={product.partnerName}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span className="text-sm text-pink-600 font-medium">
                  {product.partnerName}
                </span>
              </div>

              {/* Product Name */}
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {product.name}
              </h3>

              {/* Price */}
              <div className="text-lg font-bold text-pink-600">
                {product.isDiscounted && product.originalPrice ? (
                  <div className="flex flex-col items-center gap-1">
                    <span className="line-through text-red-500 text-sm">
                      €{product.originalPrice.toLocaleString()}
                    </span>
                    <span className="text-pink-600">
                      €{product.price.toLocaleString()}
                    </span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                      {product.discountLabel || "Last Chance"}
                    </span>
                  </div>
                ) : (
                  <span>€{product.price.toLocaleString()}</span>
                )}
              </div>

              {/* Commission Rate */}
              <div className="text-sm text-gray-500 mt-1">
                Kommission: {product.commissionRate}%
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Keine Produkte für diesen Partner gefunden.
        </div>
      )}
    </div>
  );
}
