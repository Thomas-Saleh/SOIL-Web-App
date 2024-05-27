const db = require("../database/index.js");

// Get the cart for a user.
exports.getCart = async (req, res) => {
  const cart = await db.Cart.findAll({ where: { user_id: req.params.userId } });
  res.json(cart);
};

// Add a product to the cart.
exports.addToCart = async (req, res) => {
  const cartItem = await db.Cart.create({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
    quantity: req.body.quantity
  });
  res.json(cartItem);
};

// Update the quantity of a product in the cart.
exports.updateCart = async (req, res) => {
  const cartItem = await db.Cart.findByPk(req.params.id);
  if (cartItem) {
    await cartItem.update(req.body);
    res.json(cartItem);
  } else {
    res.status(404).json({ error: "Cart item not found" });
  }
};

// Remove a product from the cart.
exports.removeFromCart = async (req, res) => {
  const cartItem = await db.Cart.findByPk(req.params.id);
  if (cartItem) {
    await cartItem.destroy();
    res.json({ message: "Cart item removed" });
  } else {
    res.status(404).json({ error: "Cart item not found" });
  }
};
