import React, { useState, useEffect } from 'react';
import { getCartItems, updateCartItem, removeCartItem } from '../data/repository'; // Import the necessary functions
import { decodeJWT } from '../utils/jwtUtils'; // Import the custom decode function
import Checkout from './Checkout';

function Cart() {
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsLoggedIn(true);
      const decodedToken = decodeJWT(sessionToken);
      const userId = decodedToken.user_id;
      // Fetch cart items from the backend
      getCartItems(userId).then(setCart).catch(console.error);
    }
  }, []);

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity: newQuantity };
        updateCartItem(itemId, newQuantity); // Update item in the backend
        return updatedItem;
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    removeCartItem(itemId); // Remove item from the backend
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  const totalPrice = cart.reduce((total, item) => total + item.product.price * item.quantity, 0); // Calculate total price

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

  return (
    <div className="flex flex-col min-h-screen">
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Shopping Cart</h1>
      </div>
      <div className="flex-grow container mx-auto p-4">
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="bg-gray-200 p-4 flex items-center justify-between mb-4 rounded-lg shadow-xl">
              <img src={item.product.imageUrl} alt={item.product.name} className="w-32 h-32 rounded-full" />
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                </div>
                <div className="flex items-center">
                  <span>
                    Quantity: 
                    <input 
                      type="number" 
                      min="1" 
                      value={item.quantity} 
                      onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} 
                      className="border rounded px-2 py-1 ml-2 w-12" 
                    />
                  </span>
                </div>
                <div className="flex items-center">
                  <span>
                    Total Price: ${(item.product.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md w-1/4 mb-4">
        <h2 className="text-xl font-semibold text-center">Total: ${totalPrice.toFixed(2)}</h2>
        <div className="flex justify-center mt-4">
          <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Checkout</button>
        </div>
        {showCheckout && <Checkout cart={cart} />}
      </div>
    </div>
  );
  
  
  
}

export default Cart;
