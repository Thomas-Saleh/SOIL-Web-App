import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Checkout from './Checkout';

function Cart() {
  // State variables for cart items and checkout display
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const userId = 1; // This should be dynamically set based on the logged-in user

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsLoggedIn(true);
      fetchCart();
    }
  }, []);

  const fetchCart = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/cart/${userId}`);
      setCart(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const updateQuantity = async (itemId, newQuantity) => {
    try {
      await axios.put(`http://localhost:3000/api/cart/${itemId}`, { quantity: newQuantity });
      fetchCart();
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };


  // Calculate total price
  const removeFromCart = async (itemId) => {
    try {
      await axios.delete(`http://localhost:3000/api/cart/${itemId}`);
      fetchCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Function to handle checkout button click
  const handleCheckout = () => {
    setShowCheckout(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Please sign in to view your cart
          </h1>
          <button onClick={() => window.location.href = '/sign-in'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // Render message if cart is empty
  if (cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">
            Your cart is empty
          </h1>
        </div>
      </div>
    );
  }

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <div>
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Shopping Cart</h1>
      </div>
      <ul>
        {cart.map((item) => (
          <li key={item.id} className="bg-gray-200 p-4 flex flex-col items-center justify-between">
            <img src={item.product.imageUrl} alt={item.product.name} className="w-32 h-32 rounded-full" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">{item.product.name}</h3>
              <span>Quantity: <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} /></span>
              <span>Total Price: ${(item.product.price * item.quantity).toFixed(2)}</span>
            </div>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => removeFromCart(item.id)}>Remove</button>
          </li>
        ))}
      </ul>
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
        <div>
          <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Checkout</button>
          {showCheckout && <Checkout cart={cart} />}
        </div>
      </div>
    </div>
  );
}

export default Cart;
