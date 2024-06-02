import React, { useState, useEffect } from 'react';
import { getCartItems, updateCartItem, removeCartItem } from '../data/repository';
import { decodeJWT } from '../utils/jwtUtils';
import Checkout from './Checkout';

function Cart() {
  // State to manage the cart items
  const [cart, setCart] = useState([]);
  // State to toggle the checkout view
  const [showCheckout, setShowCheckout] = useState(false);
  // State to check if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      console.log('Session token found:', sessionToken);
      setIsLoggedIn(true);
      const decodedToken = decodeJWT(sessionToken);
      console.log('Decoded token:', decodedToken);
      if (decodedToken && decodedToken.user_id) {
        const userId = decodedToken.user_id;
        console.log('User ID:', userId);
        // Fetch cart items if user is authenticated
        getCartItems(userId)
          .then(cartItems => {
            console.log('Cart items fetched:', cartItems);
            setCart(cartItems);
          })
          .catch(error => {
            console.error('Error fetching cart items:', error);
          });
      } else {
        console.error('Failed to decode token or user_id not found.');
      }
    } else {
      console.log('No session token found');
    }
  }, []); // Empty dependency array ensures this runs only once on mount

  const updateQuantity = (itemId, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const updatedItem = { ...item, quantity: newQuantity };
        // Update the quantity in the repository
        updateCartItem(itemId, newQuantity)
          .then(() => {
            // Update the cart state with the new quantity
            setCart(prevCart =>
              prevCart.map(item => (item.id === itemId ? updatedItem : item))
            );
          })
          .catch(error => console.error('Error updating item quantity:', error));
        return updatedItem;
      }
      return item;
    });
    setCart(updatedCart);
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter(item => item.id !== itemId);
    // Remove the item from the repository
    removeCartItem(itemId);
    setCart(updatedCart);
  };

  const handleCheckout = () => {
    setShowCheckout(true);
  };

  // Calculate total price of all items in the cart
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Render message if user is not logged in
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
                    Total Price: ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-4"
                onClick={() => removeFromCart(item.id)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div className="container mx-auto p-4 bg-white rounded-lg shadow-md w-1/3 mb-4">
        <h2 className="text-xl font-semibold text-center">Total: ${totalPrice.toFixed(2)}</h2>
        <div className="flex justify-center mt-4">
          <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Continue to payment</button>
        </div>
        {/* Render the Checkout component if showCheckout is true */}
        {showCheckout && <Checkout cart={cart} />}
      </div>
    </div>
  );
}

export default Cart;
