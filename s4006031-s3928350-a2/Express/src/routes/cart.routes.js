module.exports = (express, app) => {
  const controller = require("../controllers/cartController.js");
  const router = express.Router();

  // Get the cart for a user.
  router.get("/:userId", controller.getCart);

  // Add a product to the cart.
  router.post("/", controller.addToCart);

  // Update the quantity of a product in the cart.
  router.put("/:id", controller.updateCart);

  // Remove a product from the cart.
  router.delete("/:id", controller.removeFromCart);

  // Checkout route
  router.post("/checkout", controller.checkout);

  // Clear the cart for a user.
  router.delete("/clear/:userId", controller.clearCart);

  // Add routes to server.
  app.use("/api/cart", router);
};
