import styles from "../styles/Home.module.scss";
import secondLife from "../assets/secondLife.jpg";
import coatWoman from "../assets/coat-woman.jpg";
import backgroundImg from "../assets/Background.jpg";
import { Link, useNavigate } from "react-router-dom";
import product1a from "../assets/product1a.webp";
import product1b from "../assets/product1b.webp";
import product2a from "../assets/product2a.jpg";
import product2b from "../assets/product2b.jpg";
import product3a from "../assets/product3a.webp";
import product3b from "../assets/product3b.webp";
import product4a from "../assets/product4a.webp";
import product4b from "../assets/product4b.webp";

export default function Home() {
  const navigate = useNavigate();

  const suggestedProducts = [
    {
      id: "1",
      title: "Brown Faux Leather Clutch",
      price: "€6.99",
      image1: product1a,
      image2: product1b,
    },
    {
      id: "2",
      title: "Vintage Floral Dress",
      price: "€15.99",
      image1: product2a,
      image2: product2b,
    },
    {
      id: "3",
      title: "Boho Chic Scarf",
      price: "€4.99",
      image1: product3a,
      image2: product3b,
    },
    {
      id: "4",
      title: "Minimalist Watch",
      price: "€12.99",
      image1: product4a,
      image2: product4b,
    },
  ];

  return (
    <div className={styles.home}>
      {/* Banner Section */}
      <section className={styles.bannerSection}>
        <img
          src={backgroundImg}
          alt="Background"
          className={styles.bannerImage}
        />
        <div className={styles.bannerBox}>
          <h2>Ready to declutter your wardrobe?</h2>
          <Link to="/products">
            <button className={styles.bannerMainBtn}>Sell now</button>
          </Link>
          <Link to="/about">
            <button className={styles.bannerSecondaryBtn}>
              Learn how it works
            </button>
          </Link>
        </div>
      </section>

      {/* Welcome Message Section */}
      <div style={{ textAlign: "center", margin: "2.5rem 0 1.5rem 0" }}>
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
      </div>

      {/* Suggested Products Section */}
      <section className={styles.suggestedSection}>
        <h2 className={styles.suggestedSectionTitle}>Newest Favorites</h2>
        <div className={styles.suggestedGrid}>
          {suggestedProducts.map((p) => (
            <div
              key={p.id}
              className={styles.suggestedCard}
              onClick={() => navigate(`/products/${p.id}`)}
              tabIndex={0}
              role="button"
            >
              <div className={styles.suggestedImageWrapper}>
                <img
                  src={p.image1}
                  alt={p.title}
                  className={styles.suggestedImage}
                />
                <img
                  src={p.image2}
                  alt={p.title + " alternate"}
                  className={styles.suggestedImageFade}
                />
              </div>
              <div className={styles.suggestedInfo}>
                <div className={styles.suggestedTitleText}>{p.title}</div>
                <div className={styles.suggestedPrice}>{p.price}</div>
              </div>
            </div>
          ))}
        </div>
        <button
          className={styles.suggestedAllBtn}
          onClick={() => navigate("/products")}
        >
          See all
        </button>
      </section>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Give Clothes a Second Life</h1>
          <p>
            Join our community to buy and sell quality second-hand clothes.
            Sustainable, affordable, and stylish – for you and the planet.
          </p>
          <div className={styles.heroButtons}>
            <button className={styles.learnMore}>Why Second-Hand?</button>
            <Link to="/products">
              <button className={styles.collection}>Collection →</button>
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img src={secondLife} alt="Red Dressed Girl" />
        </div>
      </section>

      {/* Luxury Section */}
      <section className={styles.luxury}>
        <div className={styles.card}>
          <img src={coatWoman} alt="Woman with coat" />
          <div>
            <h2>Curated Second-Hand Closet</h2>
            <p>
              Explore a curated selection of high-quality, gently-used clothes
              and accessories. Each item is carefully inspected for a fresh,
              stylish look.
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards Section */}
      <section className={styles.infoCards}>
        <div className={styles.cardPink}>
          <h3>Trending Pre-Loved Finds</h3>
          <p>Best Deals Today → Top picks from our community</p>
        </div>
        <div className={styles.cardCircle}>
          <div className={styles.circle}>a</div>
          <p>25% Off Select Second-Hand Items</p>
        </div>
      </section>
    </div>
  );
}
