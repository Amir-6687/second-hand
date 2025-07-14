// // src/pages/Home.jsx
import styles from "../styles/Home.module.scss";
import redGirl from "../assets/red-girl.jpg";
import coatWoman from "../assets/coat-woman.jpg";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className="flex justify-between items-center gap-8 relative">
        <div className={styles.heroText}>
          <h1 className="text-4xl font-bold mb-4">
            Let’s go get the best discounts
          </h1>
          <p className="text-lg mb-6 max-w-xl">
            We have a lot of awesome customers from major retailers & fashion
            designers all around the world.
          </p>
          <div className="flex gap-4">
            <button className="bg-red-600 text-white px-5 py-2 rounded-full font-bold cursor-pointer">
              Learn more
            </button>
            <Link to="/products">
              <button className="border border-gray-800 px-5 py-2 rounded-full font-bold cursor-pointer hover:bg-gray-100 transition">
                Collection →
              </button>
            </Link>
          </div>
        </div>
        <div className={styles.heroImage}>
          <img
            src={redGirl}
            alt="Red Dressed Girl"
            className="rounded-xl w-64 max-w-full relative z-10"
          />
        </div>
      </section>

      {/* Luxury Closet Section */}
      <section className={`${styles.luxury} relative`}>
        <div className={styles.card}>
          <img
            src={coatWoman}
            alt="Woman with coat"
            className="rounded-xl max-w-full relative z-10"
          />
          <div>
            <h2>Luxury closet</h2>
            <p>
              Your brand new basics are designed to seamlessly blend into a
              great selection of clothes, shoes, and more – all tailored for
              your style.
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="flex gap-8 mt-16">
        <div className={`${styles.cardPink} flex-1 p-6 rounded-xl text-center`}>
          <h3 className="text-xl mb-2">Trending Offers</h3>
          <p className="font-bold">Best to Day</p>
        </div>
        <div
          className={`${styles.cardCircle} flex-1 p-6 rounded-xl text-center`}
        >
          <div className={styles.circle}>a</div>
          <p className="font-semibold text-lg">25% offer today</p>
        </div>
      </section>
    </div>
  );
}
