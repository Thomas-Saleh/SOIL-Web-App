import React, { useState, useEffect } from 'react';
import Checkout from './Checkout';

function Cart() {
  // State variables for cart items and checkout display
  const [cart, setCart] = useState([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // Load cart items from local storage
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }

    // Check if the user is logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsLoggedIn(true);
    }
  }, []);

  // Function to update the quantity of an item in the cart
  const updateQuantity = (itemName, newQuantity) => {
    const updatedCart = cart.map(item => {
      if (item.name === itemName) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  // Function to remove an item from the cart
  const removeFromCart = (itemName) => {
    const updatedCart = cart.filter(item => item.name !== itemName);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  

  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  // Function to handle checkout button click
  const handleCheckout = () => {
    setShowCheckout(true);
  };

  // If user is not logged in, show sign-in prompt
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
    <div>
      {/* Shopping cart title */}
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Shopping Cart</h1>
      </div>
      {/* Display cart items */}
      <ul>
        {cart.map((item, index) => (
          <li key={index} className="bg-gray-200 p-4 flex flex-col items-center justify-between">
            <img src={item.imageUrl} alt={item.name} className="w-32 h-32 rounded-full" />
            <div className="text-center">
              <h3 className="text-lg font-semibold">{item.name}</h3>
              <span>Quantity: <input type="number" min="1" value={item.quantity} onChange={(e) => updateQuantity(item.name, parseInt(e.target.value))} /></span>
              <span>Total Price: ${(item.price * item.quantity).toFixed(2)}</span> {/* Calculate total price */}
            </div>
            {/* Button to remove item from cart */}
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2"
              onClick={() => removeFromCart(item.name)}>Remove</button>          
            </li>
        ))}
      </ul>
      {/* Display total price and checkout button */}
      <div className="text-center mt-4">
        <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
        <div>
        {/* Button to initiate checkout process */}
        <button onClick={handleCheckout} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Checkout</button>
        {showCheckout && <Checkout cart={cart} />}
        </div>
      </div>
    </div>
  );
}

export default Cart;