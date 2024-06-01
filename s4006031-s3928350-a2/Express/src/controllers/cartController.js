const db = require("../database/index.js");
const { decodeJWT } = require('../utils/jwtUtils');

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

exports.addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header is missing' });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token is missing from authorization header' });
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const user_id = decodedToken.user_id;

    // Validate user_id exists
    const user = await db.user.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ message: 'Sign in to add items to cart!' });
    }

    // Fetch the product to get its special_price if it exists
    const product = await db.product.findByPk(product_id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const finalPrice = product.special_price !== null ? product.special_price : product.price;

    // Check if the item is already in the cart
    let cartItem = await db.cart.findOne({ where: { user_id, product_id } });

    if (cartItem) {
      // If the item is already in the cart, update its quantity and price
      cartItem.quantity += quantity;
      cartItem.price = finalPrice; // Ensure the special price is used
      await cartItem.save();
    } else {
      // If the item is not in the cart, create a new cart item
      cartItem = await db.cart.create({
        user_id,
        product_id,
        quantity,
        price: finalPrice
      });
    }

    res.status(201).json(cartItem);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ message: error.message });
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
