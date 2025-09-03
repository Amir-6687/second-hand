import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "../styles/Home.module.scss";
import SEOHead from "../components/SEOHead";
import { apiFetch, BASE_URL } from "../lib/api";

export default function Home() {
  const [newestProducts, setNewestProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        const res = await apiFetch("/products");
        if (res.ok) {
          const products = await res.json();
          // Get the 4 newest products
          const newest = products.slice(0, 4);
          console.log("Newest products:", newest);
          setNewestProducts(newest);
        }
      } catch (error) {
        console.error("Error fetching newest products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNewestProducts();
  }, []);

  return (
    <>
      <SEOHead 
        title="The Grrrls Club - Fashion & Lifestyle" 
        description="Discover unique fashion items, accessories, and lifestyle products at The Grrrls Club. Shop now for the latest trends and exclusive collections." 
        keywords="fashion, lifestyle, clothing, accessories, shopping, women, style, boutique" 
      />
      
      <main id="main-content" className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className={styles.heroSection}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Welcome to The Grrrls Club
            </h1>
            <p className={styles.heroSubtitle}>
              Discover unique fashion items and lifestyle products
            </p>
            <div className={styles.heroButtons}>
              <Link to="/products">
                <button className={styles.bannerPrimaryBtn}>
                  Shop Now
                </button>
              </Link>
              <Link to="/about">
                <button className={styles.bannerSecondaryBtn}>
                  Learn how it works
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Welcome Message Section */}
        <section style={{ textAlign: "center", margin: "2.5rem 0 1.5rem 0" }}>
          <h1
            style={{
              fontSize: "2.1rem",
              fontWeight: 700,
              marginBottom: "0.5rem",
              color: "#00897b",
            }}
          >
            Welcome to Your Second Hand Online Shop
          </h1>
          <div style={{ fontSize: "1.1rem", color: "#444", fontWeight: 500 }}>
            Save the world by giving used clothes a second life{" "}
            <span style={{ color: "#00bfae", fontWeight: 700 }}>
              #savetheworldbuysecondhand
            </span>
          </div>
        </section>

        {/* Newest Favorites Section */}
        <section className={styles.suggestedSection}>
          <h2 className={styles.suggestedSectionTitle}>Newest Favorites</h2>
          {loading ? (
            <div className={styles.suggestedGrid}>
              {[...Array(4)].map((_, index) => (
                <div key={index} className={styles.suggestedItem}>
                  <div className="animate-pulse bg-gray-200 h-48 rounded"></div>
                  <div className="animate-pulse bg-gray-200 h-4 rounded mt-2"></div>
                  <div className="animate-pulse bg-gray-200 h-4 rounded mt-1 w-2/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className={styles.suggestedGrid}>
              {newestProducts.map((product) => (
                <Link 
                  key={product._id} 
                  to={`/products/${product._id}`}
                  className={styles.suggestedItem}
                >
                  <div className={styles.suggestedImageWrapper}>
                    <img
                      src={BASE_URL + (product.images?.[0] || product.image)}
                      alt={product.name}
                      className={styles.suggestedImage}
                    />
                  </div>
                  <div className={styles.suggestedInfo}>
                    <h3 className={styles.suggestedTitle}>{product.name}</h3>
                    <p className={styles.suggestedPrice}>€{product.price.toFixed(2)}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Features Section */}
        <section className={styles.featuresSection}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.featuresTitle}>Why Choose The Grrrls Club?</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🌱</div>
                <h3 className={styles.featureTitle}>Sustainable Fashion</h3>
                <p className={styles.featureDescription}>
                  Give clothes a second life and help save the environment
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>💎</div>
                <h3 className={styles.featureTitle}>Unique Finds</h3>
                <p className={styles.featureDescription}>
                  Discover one-of-a-kind pieces you won't find anywhere else
                </p>
              </div>
              <div className={styles.featureItem}>
                <div className={styles.featureIcon}>🚚</div>
                <h3 className={styles.featureTitle}>Fast Shipping</h3>
                <p className={styles.featureDescription}>
                  Quick and reliable delivery to your doorstep
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className={styles.ctaSection}>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Start Shopping?</h2>
            <p className={styles.ctaDescription}>
              Join thousands of fashion lovers who have discovered their style at The Grrrls Club
            </p>
            <Link to="/products">
              <button className={styles.ctaButton}>
                Explore Our Collection
              </button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
