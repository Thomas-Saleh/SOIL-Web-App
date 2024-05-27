import React, { useEffect, useState } from "react";
import axios from 'axios';

function Product() {
  const [vegetables, setVegetables] = useState([]);
  const [quantities, setQuantities] = useState({});

  // Fetch vegetables from the database
  useEffect(() => {
    async function fetchVegetables() {
      try {
        const response = await axios.get('http://localhost:3000/api/products');
        setVegetables(response.data);
      } catch (error) {
        console.error("Failed to fetch vegetables:", error);
      }
    }

    fetchVegetables();
  }, []);

  // Handle quantity change
  const handleQuantityChange = (vegetableName, quantity) => {
    setQuantities((prevState) => ({
      ...prevState,
      [vegetableName]: quantity,
    }));
  };

  // Add a vegetable to the cart
  const addToCart = (vegetable) => {
    const sessionToken = localStorage.getItem("sessionToken");
    if (!sessionToken) {
      alert("You must be logged in to add items to the cart.");
      window.location.href = "/sign-in";
      return;
    }

    const quantity = quantities[vegetable.name] || 1;
    console.log(`Added ${quantity} ${vegetable.name} to cart`);

    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const existingItemIndex = cartItems.findIndex(
      (item) => item.name === vegetable.name
    );
    if (existingItemIndex !== -1) {
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      cartItems.push({ ...vegetable, quantity });
    }

    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  // Render the vegetable market
  return (
    <div>
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Vegetable Market</h1>
        <p className="text-center">Explore our selection of fresh organic vegetables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center mt-8">
        {vegetables.map((vegetable, index) => (
          <div key={index} className="bg-gray-200 p-4 flex flex-col items-center justify-between">
            <img src={vegetable.imageUrl} alt={vegetable.name} className="w-32 h-32 rounded-full" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">{vegetable.name}</h2>
              <p className="text-sm">Price: ${Number(vegetable.price).toFixed(2)}</p> {/* Ensure price is treated as a number */}
              <input
                type="number"
                min="1"
                value={quantities[vegetable.name] || ""}
                onChange={(e) => handleQuantityChange(vegetable.name, parseInt(e.target.value))}
                className="mt-2 w-16 text-center border border-gray-300 rounded"
              />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => addToCart(vegetable)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
