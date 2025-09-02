// require("dotenv").config(); // این خط اول باشه
// console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

// const express = require("express");
// const app = express();
// const cors = require("cors");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
// const connectDB = require("./db");
// connectDB();

// const allowedOrigins = [
//   process.env.FRONTEND_URL,
//   "https://thegrrrlsclub.de",
//   "https://www.thegrrrlsclub.de",
//   "http://localhost:5173",
// ];
// // app.use(
// //   cors({
// //     origin: allowedOrigins,
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //     optionsSuccessStatus: 204,
// //   })
// // );
// // app.use(
// //   cors({
// //     origin: "*", // همه origins را قبول می‌کند - فقط برای debug!
// //     credentials: true,
// //     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
// //     allowedHeaders: ["Content-Type", "Authorization"],
// //   })
// // );

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       // اگر origin موجود بود و در لیست allowedOrigins بود، قبول کن
//       if (!origin) return callback(null, true); // برای Postman یا curl
//       if (allowedOrigins.indexOf(origin) === -1) {
//         const msg =
//           "The CORS policy for this site does not allow access from the specified Origin.";
//         return callback(new Error(msg), false);
//       }
//       return callback(null, true);
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// app.options("*", cors({ origin: allowedOrigins, credentials: true }));

// app.use(express.json());
// app.use("/uploads", express.static("uploads"));

// const authRoutes = require("./routes/auth");
// app.use("/auth", authRoutes);

// const productDetailRoutes = require("./routes/productDetails");
// app.use("/product-details", productDetailRoutes);

// const orderRoutes = require("./routes/orders");
// app.use("/orders", orderRoutes);

// const productRoutes = require("./routes/products");
// app.use("/products", productRoutes);

// const inventoryRoutes = require("./routes/inventory");
// app.use("/inventory", inventoryRoutes);

// const profileRoutes = require("./routes/profile");
// app.use("/profile", profileRoutes);

// const wishlistRoutes = require("./routes/wishlist");
// app.use("/wishlist", wishlistRoutes);

// const commissionRoutes = require("./routes/commission");
// app.use("/commission", commissionRoutes);

// const userRoutes = require("./routes/users");
// app.use("/users", userRoutes);

// app.post("/create-payment-intent", async (req, res) => {
//   const { amount } = req.body;

//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount,
//       currency: "eur",
//       automatic_payment_methods: {
//         enabled: true,
//       },
//     });

//     res.send({
//       clientSecret: paymentIntent.client_secret,
//     });
//   } catch (err) {
//     console.error(err); // این خط برای لاگ خطاها ضروریه
//     res.status(500).send({ error: err.message });
//   }
// });

// // app.listen(4242, "0.0.0.0", () => console.log("Server läuft auf Port 4242"));

// const PORT = process.env.PORT || 4242;

// app.listen(PORT, "0.0.0.0", () => {
//   console.log(`✅ Server läuft auf Port ${PORT}`);
// });

require("dotenv").config(); // این خط اول باشه
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDB = require("./db");
connectDB();

// CORS configuration ساده و مؤثر
app.use(
  cors({
    origin: [
      "https://thegrrrlsclub.de",
      "https://www.thegrrrlsclub.de",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Accept",
      "Origin",
      "X-Requested-With",
    ],
    optionsSuccessStatus: 200,
  })
);

// Handle preflight requests explicitly
app.options("*", cors());

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
    console.error(err);
    res.status(500).send({ error: err.message });
  }
});

const PORT = process.env.PORT || 4242;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
});
