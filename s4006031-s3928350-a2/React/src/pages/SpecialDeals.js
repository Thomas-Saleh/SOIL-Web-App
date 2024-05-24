import React, { useState, useEffect } from 'react';


function SpecialDeals () {
  // State to hold the randomly selected product
  const [randomProducts, setRandomProducts] = useState([]);
  const discountRate = 0.4; // 20% discount
  const numOfSpecials = 5;


  useEffect(() => {
    // Retrieve vegetables from localStorage
    const storedVegetables = localStorage.getItem('vegetables');
    const vegetables = storedVegetables ? JSON.parse(storedVegetables) : [];
    
    // Shuffle the vegetables array sourced from ChatGPT asked how to randomly select items from an array
    const shuffledVegetables = vegetables.sort(() => Math.random() - 0.5);

    // Select the first numOfSpecials vegetables
    const selectedVegetables = shuffledVegetables.slice(0, numOfSpecials).map(vegetable => {
      // Apply discount to the price
      const discountedPrice = vegetable.price * (1 - discountRate);
      return { ...vegetable, price: discountedPrice };
    });
    
    // Store the selected special deal products in localStorage
    localStorage.setItem('specialDeals', JSON.stringify(selectedVegetables));

    setRandomProducts(selectedVegetables);
  }, []);

  const [quantities, setQuantities] = useState({});
  
  
  // Function to handle quantity change of a product
  const handleQuantityChange = (productName, quantity) => {
    setQuantities(prevState => ({
      ...prevState,
      [productName]: quantity
    }));
  };

  // Function to add a product to the cart
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
    <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Special Deals</h1>
      </div>      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center">
        {/* Display the shuffled and selected vegetables with discounted prices */}
        {randomProducts.map((product) => (
          <div key={product.id} className="bg-gray-200 p-4 flex flex-col items-center justify-between">
            <img src={product.imageUrl} alt={product.name} className="w-32 h-32 rounded-full" />
            <div className="text-center">
              <h2 className="text-lg font-semibold">{product.name}</h2>
              <p className="text-sm text-red-500">Special Price: ${product.price.toFixed(2)}</p>
              <input
                type="number"
                min="1"
                value={quantities[product.name] || ''}
                onChange={(e) => handleQuantityChange(product.name, parseInt(e.target.value))}
                className="mt-2 w-16 text-center border border-gray-300 rounded"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => addToCart(product)}>
            Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
    
  );
}

export default SpecialDeals;
