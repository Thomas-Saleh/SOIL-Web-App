module.exports = (express, app) => {
  const controller = require("../controllers/reviewController.js");
  const router = express.Router();

  // Get all reviews for a product.
  router.get("/product/:productId", controller.getAllReviewsForProduct);

  // Create a new review for a product.
  router.post("/product/:productId", controller.createReview);

  // Update a review.
  router.put("/:id", controller.updateReview);

  // Delete a review.
  router.delete("/:id", controller.deleteReview);

  // Add routes to server.
  app.use("/api/reviews", router);
};
