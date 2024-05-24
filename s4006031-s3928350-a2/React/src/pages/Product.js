import React, { useEffect, useMemo, useState } from "react";

function Product() {
  // Define vegetable data using useMemo to memoize the data
  const vegetables = useMemo(() => [
      // Vegetable objects with name, price, and image URL
    { name: "Carrots", price: 2.99, imageUrl: "https://images.unsplash.com/photo-1590868309235-ea34bed7bd7f?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Potato", price: 1.99, imageUrl: "https://images.unsplash.com/photo-1590165482129-1b8b27698780?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Tomato", price: 0.99, imageUrl: "https://images.unsplash.com/photo-1582284540020-8acbe03f4924?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Onions", price: 1.49, imageUrl: "https://images.unsplash.com/photo-1580201092675-a0a6a6cafbb1?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Broccoli", price: 3.49, imageUrl: "https://images.unsplash.com/photo-1606585333304-a7fa1ca4376c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Mushroom", price: 2.79, imageUrl: "https://images.unsplash.com/photo-1504545102780-26774c1bb073?q=80&w=1923&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Lettuce", price: 1.99, imageUrl: "https://images.unsplash.com/photo-1578283343206-3f7a1d347581?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Capsicum", price: 2.49, imageUrl: "https://images.unsplash.com/photo-1518736114810-3f3bedfec66a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Pumpkin", price: 4.99, imageUrl: "https://images.unsplash.com/photo-1509622905150-fa66d3906e09?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Zucchini", price: 3.29, imageUrl: "https://plus.unsplash.com/premium_photo-1675731118529-ba445c5c8d9a?q=80&w=2127&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" },
    { name: "Celery", price: 1.79, imageUrl: "https://images.unsplash.com/photo-1708436477404-1eb3b584b2b4?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" }
  ], []);

  // State to store quantities of each vegetable in the cart
  const [quantities, setQuantities] = useState({});

  // Store vegetables array in local storage
  useEffect(() => {
    localStorage.setItem('vegetables', JSON.stringify(vegetables));
  }, [vegetables]); // Include vegetables in the dependency array

  // Function to handle quantity change for a vegetable
  const handleQuantityChange = (vegetableName, quantity) => {
    setQuantities(prevState => ({
      ...prevState,
      [vegetableName]: quantity
    }));
  };

  // Function to add a vegetable to the cart
  const addToCart = (vegetable) => {
    // Check if user is logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      // Redirect to sign-in page if not logged in
      alert('You must be logged in to add items to the cart.');
      window.location.href = '/sign-in';
      return;
    }

    // Retrieve quantity of the vegetable, default to 1 if not specified
    const quantity = quantities[vegetable.name] || 1;
    console.log(`Added ${quantity} ${vegetable.name} to cart`);

    // Retrieve cart items from local storage or initialize empty array
    let cartItems = JSON.parse(localStorage.getItem('cart')) || [];

    // Check if the vegetable is already in the cart
    const existingItemIndex = cartItems.findIndex(item => item.name === vegetable.name);
    if (existingItemIndex !== -1) {
      // Update quantity if the vegetable is already in the cart
      cartItems[existingItemIndex].quantity += quantity;
    } else {
      // Add new vegetable to the cart
      cartItems.push({ ...vegetable, quantity });
    }
    // Update cart items in local storage
    localStorage.setItem('cart', JSON.stringify(cartItems));
  };
  
  // Render the vegetable market with vegetable items
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
              <p className="text-sm">Price: ${vegetable.price.toFixed(2)}</p>
              <input type="number" min="1" value={quantities[vegetable.name] || ''} onChange={(e) => handleQuantityChange(vegetable.name, parseInt(e.target.value))}
                className="mt-2 w-16 text-center border border-gray-300 rounded"
              />
            </div>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => addToCart(vegetable)}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
