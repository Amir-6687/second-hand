require("dotenv").config(); // این خط اول باشه
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDB = require("./db");
connectDB();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const authRoutes = require("./routes/auth");
app.use("/auth", authRoutes);

const productDetailRoutes = require("./routes/productDetails");
app.use("/product-details", productDetailRoutes);

const orderRoutes = require("./routes/orders");
app.use("/orders", orderRoutes);

const productRoutes = require("./routes/products");
app.use("/products", productRoutes);

const inventoryRoutes = require("./routes/inventory");
app.use("/inventory", inventoryRoutes);

const profileRoutes = require("./routes/profile");
app.use("/profile", profileRoutes);

const wishlistRoutes = require("./routes/wishlist");
app.use("/wishlist", wishlistRoutes);

const commissionRoutes = require("./routes/commission");
app.use("/commission", commissionRoutes);

const userRoutes = require("./routes/users");
app.use("/users", userRoutes);

app.post("/create-payment-intent", async (req, res) => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "eur",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (err) {
    console.error(err); // این خط برای لاگ خطاها ضروریه
    res.status(500).send({ error: err.message });
  }
});

app.listen(4242, "0.0.0.0", () => console.log("Server läuft auf Port 4242"));
