import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { addCartItem, getAllReviewsForProduct } from "../data/repository"; // Import the addCartItem function
import { decodeJWT } from '../utils/jwtUtils'; // Import the custom decode function
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';


function Product() {
  const [vegetables, setVegetables] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [reviews, setReviews] = useState({}); // Store reviews for each product
  const [showReviewForm, setShowReviewForm] = useState({});
  const [showReviewList, setShowReviewList] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});

  // Define fetchVegetables function
  const fetchVegetables = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setVegetables(response.data);
      // Fetch review counts for each product
      const reviewCountsData = {};
      for (const product of response.data) {
        const reviewsData = await getAllReviewsForProduct(product.id);
        reviewCountsData[product.id] = reviewsData.length;
      }
      setReviewCounts(reviewCountsData);

    } catch (error) {
      console.error("Failed to fetch vegetables:", error);
    }
  };
    
  // Define fetchReviews function
  const fetchReviews = useCallback(async (productId) => {
    try {
      const reviewsData = await getAllReviewsForProduct(productId);
      setReviews((prevState) => ({
        ...prevState,
        [productId]: reviewsData,
      }));
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  }, []);

  // Fetch vegetables from the database
  useEffect(() => {
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
  const addToCart = async (vegetable) => {
    const sessionToken = localStorage.getItem("sessionToken");
    console.log("Session token:", sessionToken);

    if (!sessionToken) {
      alert("You must be logged in to add items to the cart.");
      window.location.href = "/sign-in";
      return;
    }

    const decodedToken = decodeJWT(sessionToken);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken) {
      alert("Invalid session token.");
      return;
    }

    const user_id = decodedToken.user_id;
    const quantity = quantities[vegetable.name] || 1;
    console.log(`Adding ${quantity} ${vegetable.name} to cart`);

    try {
      const cartItem = await addCartItem({
        user_id,
        product_id: vegetable.id,
        quantity
      });

      console.log("Item added to cart:", cartItem);
      alert(`${vegetable.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert("Failed to add item to cart. Please try again.");
    }
  };

  const toggleReviewForm = (productId) => {
    setShowReviewForm(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  const toggleReviewList = (productId) => {
    setShowReviewList(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  const handleReviewAdded = async (productId) => {
    await fetchReviews(productId);
    setReviewCounts(prevState => ({
      ...prevState,
      [productId]: prevState[productId] + 1
    }));
    setShowReviewForm(prevState => ({
      ...prevState,
      [productId]: false
    }));
  };


  // Render the vegetable market
  return (
    <div className="box bg-F7B787">
      <div className="bg-green-800 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Vegetable Market</h1>
        <p className="text-center">Explore our selection of fresh organic vegetables.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center mt-8 px-4">
        {vegetables.map((vegetable) => (
          <div key={vegetable.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center mb-4">
            <img src={vegetable.imageUrl} alt={vegetable.name} className="w-24 h-24 rounded-full p-2 bg-gray-100" />
            <div className="text-center mt-2">
              <h2 className="text-lg font-semibold text-gray-800">{vegetable.name}</h2>
              <p className="text-sm text-gray-600 mt-1">Price: ${Number(vegetable.price).toFixed(2)}</p>
              <input
                type="number"
                min="1"
                value={quantities[vegetable.name] || ""}
                onChange={(e) => handleQuantityChange(vegetable.name, parseInt(e.target.value))}
                className="mt-1 w-12 text-center border border-gray-300 rounded"
              />
            </div>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
              onClick={() => addToCart(vegetable)}
            >
              Add to Cart
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
              onClick={() => toggleReviewForm(vegetable.id)}
            >
              Leave a Review
            </button>
            {showReviewForm[vegetable.id] && (
              <ReviewForm productId={vegetable.id} onReviewAdded={() => handleReviewAdded(vegetable.id)} />
            )}
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
              onClick={() => toggleReviewList(vegetable.id)}
            >
              {`See Reviews (${reviewCounts[vegetable.id] || 0})`}
            </button>
            {showReviewList[vegetable.id] && (
              <ReviewList productId={vegetable.id} reviews={reviews[vegetable.id] || []} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product;
