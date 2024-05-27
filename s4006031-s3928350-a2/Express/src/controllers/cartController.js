const db = require("../database/index.js");

// Get the cart for a user.
exports.getCart = async (req, res) => {
  try {
    const cart = await db.cart.findAll({ where: { user_id: req.params.userId } });
    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Add a product to the cart.
exports.addToCart = async (req, res) => {
  try {
    const cartItem = await db.cart.create({
      user_id: req.body.user_id,
      product_id: req.body.product_id,
      quantity: req.body.quantity
    });
    res.json(cartItem);
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update the quantity of a product in the cart.
exports.updateCart = async (req, res) => {
  try {
    const cartItem = await db.cart.findByPk(req.params.id);
    if (cartItem) {
      await cartItem.update(req.body);
      res.json(cartItem);
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Remove a product from the cart.
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await db.cart.findByPk(req.params.id);
    if (cartItem) {
      await cartItem.destroy();
      res.json({ message: 'Cart item removed' });
    } else {
      res.status(404).json({ error: 'Cart item not found' });
    }
  } catch (error) {
    console.error('Error removing from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
