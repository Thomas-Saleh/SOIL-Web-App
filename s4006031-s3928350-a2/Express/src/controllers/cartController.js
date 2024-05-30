const db = require("../database/index.js");

// Get the cart for a user.
exports.getCart = async (req, res) => {
  try {
    const cartItems = await db.cart.findAll({
      where: { user_id: req.params.userId },
      include: [{
        model: db.product,
        attributes: ['id', 'name', 'price', 'imageUrl'] // Include necessary product attributes
      }]
    });
    res.json(cartItems);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Failed to fetch cart" });
  }
};

// Add a product to the cart.
exports.addToCart = async (req, res) => {
  try {
    const { user_id, product_id, quantity } = req.body;

    if (!user_id || !product_id || !quantity) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("Creating cart item with:", { user_id, product_id, quantity });

    const cartItem = await db.cart.create({
      user_id,
      product_id,
      quantity
    });

    console.log("Cart item created successfully:", cartItem);
    res.json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "Failed to add to cart" });
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
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    console.error("Error updating cart:", error);
    res.status(500).json({ error: "Failed to update cart" });
  }
};

// Remove a product from the cart.
exports.removeFromCart = async (req, res) => {
  try {
    const cartItem = await db.cart.findByPk(req.params.id);
    if (cartItem) {
      await cartItem.destroy();
      res.json({ message: "Cart item removed" });
    } else {
      res.status(404).json({ error: "Cart item not found" });
    }
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Failed to remove from cart" });
  }
};

// Checkout and clear the cart
exports.checkout = async (req, res) => {
  try {
    const { userId } = req.body;

    // Implement any necessary logic for processing the checkout here
    // For now, just clearing the cart
    await db.cart.destroy({ where: { user_id: userId } });

    res.json({ message: 'Checkout successful and cart cleared' });
  } catch (error) {
    console.error('Error during checkout:', error);
    res.status(500).json({ error: 'Failed to process checkout' });
  }
};

// Clear the cart for a user
exports.clearCart = async (req, res) => {
  try {
    const { userId } = req.body;
    await db.cart.destroy({ where: { user_id: userId } });
    res.json({ message: 'Cart cleared' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
};