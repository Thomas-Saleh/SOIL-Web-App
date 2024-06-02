import React, { useEffect, useState, useCallback } from "react";
import axios from 'axios';
import { getAllReviewsForProduct } from "../data/repository";
import { decodeJWT } from '../utils/jwtUtils';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function Products() {
  // State variables for products, quantities, reviews, and UI state
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [reviews, setReviews] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({});
  const [showReviewList, setShowReviewList] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});

  // Fetch products and their review counts
  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);

      const reviewCountsData = {};
      for (const product of response.data) {
        const reviewsData = await getAllReviewsForProduct(product.id);
        reviewCountsData[product.id] = reviewsData.length;
      }
      setReviewCounts(reviewCountsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  // Fetch reviews for a specific product
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

  // Initial fetch of products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle change in product quantity
  const handleQuantityChange = (productId, quantity) => {
    setQuantities((prevState) => ({
      ...prevState,
      [productId]: quantity,
    }));
  };

  // Add a product to the cart
  const addToCart = async (product) => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('You must be logged in to add items to the cart.');
      window.location.href = '/sign-in';
      return;
    }

    const decodedToken = decodeJWT(sessionToken);
    if (!decodedToken) {
      alert("Invalid session token.");
      return;
    }

    const quantity = quantities[product.id] || 1;
    console.log(`Adding ${quantity} ${product.name} to cart`);

    try {
      const cartItem = await axios.post('http://localhost:3000/api/cart', {
        product_id: product.id,
        quantity,
        price: product.special_price || product.price // Using the special price if available
      }, {
        headers: {
          'Authorization': `Bearer ${sessionToken}`
        }
      });

      console.log("Item added to cart:", cartItem.data);
      alert(`${product.name} added to cart!`);
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      alert(error.response?.data?.message || "Failed to add item to cart. Please try again.");
    }
  };

  // Toggle the visibility of the review form for a product
  const toggleReviewForm = (productId) => {
    setShowReviewForm(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  // Toggle the visibility of the review list for a product
  const toggleReviewList = (productId) => {
    setShowReviewList(prevState => ({
      ...prevState,
      [productId]: !prevState[productId]
    }));
  };

  // Handle the addition of a new review
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

  return (
    <div className="box bg-F7B787">
      {/* Header section */}
      <div className="bg-green-800 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Vegetable Market</h1>
        <p className="text-center">Explore our selection of fresh organic vegetables.</p>
      </div>

      {/* Product listing grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center mt-8 px-4">
        {products.map((product) => (
          <div key={product.id} className="bg-white border border-gray-300 rounded-lg shadow-md p-4 flex flex-col items-center mb-4">
            {/* Product image */}
            <img src={product.imageUrl} alt={product.name} className="w-24 h-24 rounded-full p-2 bg-gray-100" />
            <div className="text-center mt-2">
              {/* Product name and price */}
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
              {/* Quantity input */}
              <input
                type="number"
                min="1"
                value={quantities[product.id] || ""}
                onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value))}
                className="mt-1 w-12 text-center border border-gray-300 rounded"
              />
            </div>
            {/* Add to cart button */}
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>
            {/* Toggle review form button */}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
              onClick={() => toggleReviewForm(product.id)}
            >
              Leave a Review
            </button>
            {/* Render review form if toggled */}
            {showReviewForm[product.id] && (
              <ReviewForm productId={product.id} onReviewAdded={() => handleReviewAdded(product.id)} />
            )}
            {/* Toggle review list button */}
            <button
              className="bg-yellow-500 hover:bg-yellow-700 text-white font-medium rounded-md text-sm px-4 py-2 mt-2"
              onClick={() => toggleReviewList(product.id)}
            >
              {`See Reviews (${reviewCounts[product.id] || 0})`}
            </button>
            {/* Render review list if toggled */}
            {showReviewList[product.id] && (
              <ReviewList productId={product.id} reviews={reviews[product.id] || []} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Products;
