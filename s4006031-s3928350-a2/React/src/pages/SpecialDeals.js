import React, { useState, useEffect } from 'react';
import { getSpecialDeals, setSpecialDeals } from "../data/repository";
import axios from 'axios';

function SpecialDeals() {
  const [randomProducts, setRandomProducts] = useState([]);
  const discountRate = 0.4; // 40% discount
  const numOfSpecials = 5;
  const [quantities, setQuantities] = useState({});

  useEffect(() => {
    async function fetchSpecialDeals() {
      try {
        console.log("Fetching special deals...");
        let specialDeals = await getSpecialDeals();
        console.log("Fetched special deals:", specialDeals);

        // Check if specialDeals is null or undefined
        if (!specialDeals) {
          console.error("Special deals data is null or undefined");
          specialDeals = [];
        }

        if (specialDeals.length === 0) {
          console.log("No special deals found, fetching all products...");
          // Fetch all products
          const response = await axios.get('http://localhost:3000/api/products');
          const products = response.data;
          console.log("Fetched products:", products);

          // Shuffle the products array
          const shuffledProducts = products.sort(() => Math.random() - 0.5);
          console.log("Shuffled products:", shuffledProducts);

          // Select the first numOfSpecials products and apply discount
          specialDeals = shuffledProducts.slice(0, numOfSpecials).map(product => {
            const discountedPrice = product.price * (1 - discountRate);
            return { ...product, price: discountedPrice };
          });
          console.log("Special deals with discounts applied:", specialDeals);

          // Use the discounted products directly instead of refetching
          setRandomProducts(specialDeals);

          // Remove the id field before saving special deals to the database
          const dealsWithoutId = specialDeals.map(({ id, ...rest }) => rest);

          // Save special deals to the database
          console.log("Saving special deals to the database...");
          await setSpecialDeals(dealsWithoutId);
          console.log("Special deals saved to the database.");
        } else {
          setRandomProducts(specialDeals);
          console.log("Setting special deals from database:", specialDeals);
        }
      } catch (error) {
        console.error("Failed to fetch special deals:", error);
      }
    }

    fetchSpecialDeals();
  }, []);

  const handleQuantityChange = (productName, quantity) => {
    setQuantities(prevState => ({
      ...prevState,
      [productName]: quantity
    }));
  };

  const addToCart = (product) => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('You must be logged in to add items to the cart.');
      window.location.href = '/sign-in';
      return;
    }
    
    const quantity = quantities[product.name] || 1; // Default quantity is 1
    console.log(`Added ${quantity} ${product.name} to cart`);
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItems = cartItems.findIndex(item => item.name === product.name);
    if (existingItems !== -1) {
      cartItems[existingItems].quantity += quantity;
    } else {
      cartItems.push({ ...product, quantity });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };

  return (
    <div>
      <div className="bg-green-600 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Special Deals</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center mt-8 px-4">
        {randomProducts.length === 0 ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          randomProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-300 rounded-lg shadow-lg p-6 flex flex-col items-center">
              <img src={product.imageUrl} alt={product.name} className="w-32 h-32 rounded-full p-2 bg-gray-100" />
              <div className="text-center mt-4">
                <h2 className="text-xl font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-red-500 mt-2">Special Price: ${Number(product.price).toFixed(2)}</p>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.name] || ''}
                  onChange={(e) => handleQuantityChange(product.name, parseInt(e.target.value))}
                  className="mt-2 w-16 text-center border border-gray-300 rounded"
                />
              </div>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );  
}

export default SpecialDeals;
