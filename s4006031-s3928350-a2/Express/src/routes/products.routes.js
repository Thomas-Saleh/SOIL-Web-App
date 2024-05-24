module.exports = (express, app) => {
  const controller = require("../controllers/productController.js");
  const router = express.Router();

  // Get all products.
  router.get("/", controller.getAllProducts);

  // Get a single product by ID.
  router.get("/:id", controller.getProductById);

  // Add a new product.
  router.post("/", controller.createProduct);

  // Update an existing product.
  router.put("/:id", controller.updateProduct);

  // Delete a product.
  router.delete("/:id", controller.deleteProduct);

  // Add routes to server.
  app.use("/api/products", router);
};
