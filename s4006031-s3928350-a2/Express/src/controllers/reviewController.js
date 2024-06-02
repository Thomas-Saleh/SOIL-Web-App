const db = require("../database/index.js");
// Get all reviews for a product.
exports.getAllReviewsForProduct = async (req, res) => {
  try {
    const reviews = await db.review.findAll({
      where: { product_id: req.params.productId },
      include: [{
        model: db.user,
        attributes: ['username'] // Include the username from the user table
      }]
    });
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ error: "Failed to fetch reviews" });
  }
};

// Create a new review for a product.
exports.addReview = async (req, res) => {
  const { user_id, review_text, star_rating } = req.body;
  const { productId } = req.params;

  console.log('Received data for creating review:', { user_id, review_text, star_rating, productId });

  try {
    const user = await db.user.findByPk(user_id);
    const product = await db.product.findByPk(productId);

    if (!user || !product) {
      return res.status(400).json({ error: 'Invalid user_id or product_id' });
    }

    const review = await db.review.create({
      user_id,
      product_id: productId,
      review_text,
      star_rating
    });
    res.json(review);
  } catch (error) {
    console.error('Error creating review:', error.message);
    console.error('Stack trace:', error.stack);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

// Update a review.
exports.updateReview = async (req, res) => {
  const review = await db.review.findByPk(req.params.id);
  if (review) {
    await review.update(req.body);
    res.json(review);
  } else {
    res.status(404).json({ error: "Review not found" });
  }
};

// Delete a review.
exports.deleteReview = async (req, res) => {
  const review = await db.review.findByPk(req.params.id);
  if (review) {
    await review.destroy();
    res.json({ message: "Review deleted" });
  } else {
    res.status(404).json({ error: "Review not found" });
  }
};
