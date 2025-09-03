require("dotenv").config();
console.log("Stripe Secret Key:", process.env.STRIPE_SECRET_KEY);

const express = require("express");
const app = express();
const cors = require("cors");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const connectDB = require("./db");
connectDB();

// CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "https://thegrrrlsclub.de",
  "https://www.thegrrrlsclub.de",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:3000"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // For development, allow localhost with any port
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return callback(null, true);
      }
      
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type", 
      "Authorization", 
      "X-Requested-With",
      "Accept",
      "Origin"
    ],
    optionsSuccessStatus: 200,
    preflightContinue: false
  })
);

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Static files
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/auth", require("./routes/auth"));
app.use("/products", require("./routes/products"));
app.use("/orders", require("./routes/orders"));
app.use("/users", require("./routes/users"));
app.use("/profile", require("./routes/profile"));
app.use("/wishlist", require("./routes/wishlist"));
app.use("/inventory", require("./routes/inventory"));
app.use("/productDetails", require("./routes/productDetails"));
app.use("/commission", require("./routes/commission"));

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ 
    status: "OK", 
    message: "Server is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Stripe Payment Intent endpoint
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, items, userId } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: "eur",
      metadata: {
        userId: userId || "anonymous",
        items: JSON.stringify(items || [])
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ error: "Failed to create payment intent" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);
  
  if (err.message.includes("CORS")) {
    return res.status(403).json({ 
      error: "CORS Error", 
      message: err.message,
      allowedOrigins: allowedOrigins
    });
  }
  
  res.status(500).json({ 
    error: "Internal Server Error",
    message: process.env.NODE_ENV === 'development' ? err.message : "Something went wrong"
  });
});

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Route not found" });
});

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`✅ Server läuft auf Port ${PORT}`);
  console.log(`🌐 CORS enabled for origins:`, allowedOrigins);
  console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
});
