const db = require("../database/index.js");
// Get all reviews for a product.
exports.getAllReviewsForProduct = async (req, res) => {
  const reviews = await db.Review.findAll({ where: { product_id: req.params.productId } });
  res.json(reviews);
};

// Create a new review for a product.
exports.createReview = async (req, res) => {
  const review = await db.Review.create({
    user_id: req.body.user_id,
    product_id: req.params.productId,
    review_text: req.body.review_text,
    star_rating: req.body.star_rating
  });
  res.json(review);
};

// Update a review.
exports.updateReview = async (req, res) => {
  const review = await db.Review.findByPk(req.params.id);
  if (review) {
    await review.update(req.body);
    res.json(review);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
};

// Delete a review.
exports.deleteReview = async (req, res) => {
  const review = await db.Review.findByPk(req.params.id);
  if (review) {
    await review.destroy();
    res.json({ message: "Review deleted" });
  } else {
    res.status(404).json({ error: "Review not found" });
  }
};
