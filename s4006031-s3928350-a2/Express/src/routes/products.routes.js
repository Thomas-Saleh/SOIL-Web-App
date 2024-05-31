module.exports = (express, app) => {
  const controller = require("../controllers/productController.js");
  const router = express.Router();

  // Get all products.
  router.get("/", controller.getAllProducts);

  // Get a single product by ID.
  router.get("/:id", controller.getProductById);

  // Add a new product.
  router.post("/", controller.createProduct);

  // Populate the database with initial data.
  router.post("/populate", controller.populateDatabase);

  // Get special deals
  router.get("/special-deals", controller.getSpecialDeals);

  // Set special deals
  router.post("/special-deals", controller.setSpecialDeals);

  // Add routes to server.
  app.use("/api/products", router);
};
