import React, { useState, useEffect } from 'react';
import { getSpecialDeals, setSpecialDeals, getAllReviewsForProduct } from "../data/repository"; // Import repository functions
import axios from 'axios'; // Import axios for making HTTP requests
import { decodeJWT } from '../utils/jwtUtils'; // Import JWT decoding utility
import ReviewForm from './ReviewForm'; // Import ReviewForm component
import ReviewList from './ReviewList'; // Import ReviewList component

function SpecialDeals() {
  // State variables
  const [specialDeals, setSpecialDealsState] = useState([]); // State for special deals
  const [quantities, setQuantities] = useState({}); // State for quantities of products
  const [showReviewForm, setShowReviewForm] = useState({}); // State to show or hide review form
  const [showReviewList, setShowReviewList] = useState({}); // State to show or hide review list
  const [reviewCounts, setReviewCounts] = useState({}); // State for count of reviews per product
  const discountRate = 0.5; // Discount rate for special deals
  const numOfSpecials = 5; // Number of special deals to show

  // useEffect hook to fetch special deals on component mount
  useEffect(() => {
    async function fetchSpecialDeals() {
      try {
        let deals = await getSpecialDeals(); // Fetch special deals from repository

        if (!deals || deals.length === 0) { // If no deals found, fetch products and set special deals
          const response = await axios.get('http://localhost:3000/api/products');
          const products = response.data;

          // Shuffle products and take a slice for special deals
          const shuffledProducts = products.sort(() => Math.random() - 0.5);
          deals = shuffledProducts.slice(0, numOfSpecials).map(product => {
            const discountedPrice = product.price * (1 - discountRate);
            return { ...product, special_price: discountedPrice, product_id: product.id };
          });

          await setSpecialDeals(deals); // Save special deals to repository

          // Update special prices on server
          const specialPrices = deals.map(deal => ({
            product_id: deal.product_id,
            special_price: deal.special_price
          }));
          await axios.post('http://localhost:3000/api/products/update-special-prices', { specialPrices });
        }

        setSpecialDealsState(deals); // Update state with special deals

        // Fetch and set review counts for each deal
        const reviewCountsData = {};
        for (const deal of deals) {
          const reviews = await getAllReviewsForProduct(deal.product_id);
          reviewCountsData[deal.product_id] = reviews ? reviews.length : 0;
        }
        setReviewCounts(reviewCountsData);

      } catch (error) {
        console.error("Failed to fetch special deals:", error); // Handle errors
      }
    }

    fetchSpecialDeals(); // Call the async function
  }, []);

  // Handle quantity change for a product
  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prevState => ({
      ...prevState,
      [productId]: quantity
    }));
  };

  // Add product to cart
  const addToCart = async (product) => {
    const sessionToken = localStorage.getItem('sessionToken'); // Get session token from local storage
    if (!sessionToken) {
      alert('You must be logged in to add items to the cart.'); // Prompt user to log in if not authenticated
      window.location.href = '/sign-in';
      return;
    }

    const decodedToken = decodeJWT(sessionToken); // Decode JWT token
    if (!decodedToken) {
      alert("Invalid session token."); // Handle invalid token
      return;
    }

    const quantity = quantities[product.product_id] || 1; // Get quantity for the product
    console.log(`Adding ${quantity} ${product.name} to cart`);

    try {
      // Add item to cart via API
      const cartItem = await axios.post('http://localhost:3000/api/cart', {
        product_id: product.product_id,
        quantity,
      }, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      console.log("Item added to cart:", cartItem.data);
      alert(`${product.name} added to cart!`); // Notify user of successful addition
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert(error.response?.data?.message || "Failed to add item to cart. Please try again."); // Handle errors
    }
  };

  // Toggle visibility of review form
  const toggleReviewForm = (productId) => {
    setShowReviewForm(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  // Toggle visibility of review list
  const toggleReviewList = (productId) => {
    setShowReviewList(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  // Handle review added event
  const handleReviewAdded = async (productId) => {
    const reviews = await getAllReviewsForProduct(productId); // Fetch reviews for the product
    setReviewCounts(prevState => ({
      ...prevState,
      [productId]: reviews.length
    }));
    setShowReviewForm(prevState => ({
      ...prevState,
      [productId]: false
    }));
  };

  // Render component
  return (
    <div className="box bg-F7B787">
      <div className="bg-green-600 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Special Deals</h1>
      </div>
      <div className="bg-red-500 text-white py-2">
        <h1 className="text-2xl font-semibold text-center">50% Off Buy Now! </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center mt-8 px-4">
        {specialDeals.length === 0 ? ( // Display loading message if no deals are available
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          specialDeals.map((product) => ( // Map through special deals and render product cards
            <div key={product.product_id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center mb-4">
              <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-full p-2 bg-gray-100" />
              <div className="text-center mt-2">
                <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {product.special_price ? (
                    <>
                      <span className="line-through">${Number(product.price).toFixed(2)}</span>{' '}
                      <span className="text-red-500">${Number(product.special_price).toFixed(2)}</span>
                    </>
                  ) : (
                    `$${Number(product.price).toFixed(2)}`
                  )}
                </p>
                <input
                  type="number"
                  min="1"
                  value={quantities[product.product_id] || ''}
                  onChange={(e) => handleQuantityChange(product.product_id, parseInt(e.target.value))}
                  className="mt-1 w-12 text-center border border-gray-300 rounded"
                />
              </div>
              <button
                className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
                onClick={() => toggleReviewForm(product.product_id)}
              >
                Leave a Review
              </button>
              {showReviewForm[product.product_id] && (
                <ReviewForm productId={product.product_id} onReviewAdded={() => handleReviewAdded(product.product_id)} />
              )}
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
                onClick={() => toggleReviewList(product.product_id)}
              >
                {`See Reviews (${reviewCounts[product.product_id] || 0})`}
              </button>
              {showReviewList[product.product_id] && (
                <ReviewList productId={product.product_id} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SpecialDeals; 
