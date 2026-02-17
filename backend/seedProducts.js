const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();

const connectDB = async () => {
  try {
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/thegrrrlsclub";
    await mongoose.connect(mongoUri);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

const seedProducts = async () => {
  try {
    await connectDB();

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    const products = [
      {
        name: "Vintage Leather Jacket",
        price: 89.99,
        originalPrice: 129.99,
        isDiscounted: true,
        discountLabel: "Last Chance",
        description:
          "Beautiful vintage leather jacket in excellent condition. Perfect for any wardrobe.",
        zustand: "gut",
        width: 45,
        depth: 10,
        height: 60,
        brand: "Vintage Co.",
        model: "Classic Black",
        color: "Black",
        material: "Leather",
        pattern: "Solid",
        images: ["https://via.placeholder.com/400x500?text=Vintage+Jacket"],
        active: true,
        ratings: [],
      },
      {
        name: "Designer Handbag",
        price: 149.99,
        originalPrice: 199.99,
        isDiscounted: true,
        discountLabel: "Sale",
        description:
          "Elegant designer handbag made from premium materials. Great for everyday use.",
        zustand: "sehr gut",
        width: 35,
        depth: 15,
        height: 28,
        brand: "Designer Brand",
        model: "Urban Chic",
        color: "Cognac",
        material: "Faux Leather",
        pattern: "Solid",
        images: ["https://via.placeholder.com/400x500?text=Designer+Handbag"],
        active: true,
        ratings: [],
      },
      {
        name: "Classic White Sneakers",
        price: 79.99,
        originalPrice: 99.99,
        isDiscounted: true,
        discountLabel: "Flash Sale",
        description:
          "Timeless white sneakers that go with everything. Comfortable and stylish.",
        zustand: "neu",
        width: 10,
        depth: 20,
        height: 15,
        brand: "Sneaker Pro",
        model: "Classic",
        color: "White",
        material: "Canvas",
        pattern: "Solid",
        images: ["https://via.placeholder.com/400x500?text=White+Sneakers"],
        active: true,
        ratings: [],
      },
      {
        name: "Summer Dress",
        price: 59.99,
        originalPrice: 89.99,
        isDiscounted: true,
        discountLabel: "End of Season",
        description:
          "Light and breezy summer dress perfect for warm weather. Comfortable and flattering fit.",
        zustand: "neu",
        width: 42,
        depth: 5,
        height: 95,
        brand: "Fashion House",
        model: "Breezy Summer",
        color: "Blue",
        material: "Cotton",
        pattern: "Floral",
        images: ["https://via.placeholder.com/400x500?text=Summer+Dress"],
        active: true,
        ratings: [],
      },
      {
        name: "Wool Coat",
        price: 199.99,
        originalPrice: 279.99,
        isDiscounted: true,
        discountLabel: "Winter Sale",
        description:
          "Warm and cozy wool coat for cold seasons. Classic design that never goes out of style.",
        zustand: "gut",
        width: 50,
        depth: 12,
        height: 100,
        brand: "Winter Wear",
        model: "Cozy Classic",
        color: "Gray",
        material: "Wool",
        pattern: "Solid",
        images: ["https://via.placeholder.com/400x500?text=Wool+Coat"],
        active: true,
        ratings: [],
      },
    ];

    const result = await Product.insertMany(products);
    console.log(`✅ ${result.length} products seeded successfully`);

    // Display the seeded products
    console.log("\nSeeded Products:");
    result.forEach((product) => {
      console.log(`- ${product.name} (ID: ${product._id})`);
    });

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding products:", error);
    process.exit(1);
  }
};

seedProducts();
