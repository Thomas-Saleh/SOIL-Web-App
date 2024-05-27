const db = require("../database/index.js");

// Vegetable data to populate the database
const vegetables = [
  { name: "Carrots", price: 2.99, imageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Potato", price: 1.99, imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Tomato", price: 0.99, imageUrl: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Onions", price: 1.49, imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Broccoli", price: 3.49, imageUrl: "https://images.unsplash.com/photo-1606585333304-a7fa1ca4376c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Mushroom", price: 2.79, imageUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Lettuce", price: 1.99, imageUrl: "https://images.unsplash.com/photo-1578283343206-3f7a1d347581?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Capsicum", price: 2.49, imageUrl: "https://images.unsplash.com/photo-1518736114810-3f3bedfec66a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Pumpkin", price: 4.99, imageUrl: "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Zucchini", price: 3.29, imageUrl: "https://plus.unsplash.com/premium_photo-1675731118529-ba445c5c8d9a?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
  { name: "Celery", price: 1.79, imageUrl: "https://images.unsplash.com/photo-1708436477404-1eb3b584b2b4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
];

// Function to populate the database with initial vegetable data
exports.populateDatabase = async () => {
  try {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 0', { raw: true });

    // Drop tables in the correct order
    await db.sequelize.getQueryInterface().dropTable('follows');
    await db.sequelize.getQueryInterface().dropTable('carts');
    await db.sequelize.getQueryInterface().dropTable('reviews');
    await db.sequelize.getQueryInterface().dropTable('products');

    await db.sequelize.sync({ force: true });

    await db.product.bulkCreate(vegetables);
    console.log("Database populated!");
  } catch (error) {
    console.error("Error populating database:", error);
  } finally {
    await db.sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await db.product.findAll();
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// Get a single product by ID from the database.
exports.getProductById = async (req, res) => {
  const product = await db.product.findByPk(req.params.id);
  res.json(product);
};

// Create a new product in the database.
exports.createProduct = async (req, res) => {
  const product = await db.product.create(req.body);
  res.json(product);
};

// Update an existing product in the database.
exports.updateProduct = async (req, res) => {
  const product = await db.product.findByPk(req.params.id);
  if (product) {
    await product.update(req.body);
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};

// Delete a product from the database.
exports.deleteProduct = async (req, res) => {
  const product = await db.product.findByPk(req.params.id);
  if (product) {
    await product.destroy();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};

