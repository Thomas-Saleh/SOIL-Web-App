const db = require("../database/index.js");
// Get all products from the database.
exports.getAllProducts = async (req, res) => {
  const products = await db.Product.findAll();
  res.json(products);
};

// Get a single product by ID from the database.
exports.getProductById = async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);
  res.json(product);
};

// Create a new product in the database.
exports.createProduct = async (req, res) => {
  const product = await db.Product.create(req.body);
  res.json(product);
};

// Update an existing product in the database.
exports.updateProduct = async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);
  if (product) {
    await product.update(req.body);
    res.json(product);
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};

// Delete a product from the database.
exports.deleteProduct = async (req, res) => {
  const product = await db.Product.findByPk(req.params.id);
  if (product) {
    await product.destroy();
    res.json({ message: "Product deleted" });
  } else {
    res.status(404).json({ error: "Product not found" });
  }
};
