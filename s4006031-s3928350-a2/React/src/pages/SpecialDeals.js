import React, { useState, useEffect } from 'react';
import { getSpecialDeals, setSpecialDeals, getAllReviewsForProduct } from "../data/repository";
import axios from 'axios';
import { decodeJWT } from '../utils/jwtUtils';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function SpecialDeals() {
  const [specialDeals, setSpecialDealsState] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({});
  const [showReviewList, setShowReviewList] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});
  const discountRate = 0.5; // 50% discount
  const numOfSpecials = 5;

  useEffect(() => {
    async function fetchSpecialDeals() {
      try {
        let deals = await getSpecialDeals();

        if (!deals || deals.length === 0) {
          const response = await axios.get('http://localhost:3000/api/products');
          const products = response.data;

          const shuffledProducts = products.sort(() => Math.random() - 0.5);
          deals = shuffledProducts.slice(0, numOfSpecials).map(product => {
            const discountedPrice = product.price * (1 - discountRate);
            return { ...product, special_price: discountedPrice, product_id: product.id };
          });

          await setSpecialDeals(deals);

          const specialPrices = deals.map(deal => ({
            product_id: deal.product_id,
            special_price: deal.special_price
          }));

          await axios.post('http://localhost:3000/api/products/update-special-prices', { specialPrices });
        }

        setSpecialDealsState(deals);

        const reviewCountsData = {};
        for (const deal of deals) {
          const reviews = await getAllReviewsForProduct(deal.product_id);
          reviewCountsData[deal.product_id] = reviews ? reviews.length : 0;
        }
        setReviewCounts(reviewCountsData);

      } catch (error) {
        console.error("Failed to fetch special deals:", error);
      }
    }

    fetchSpecialDeals();
  }, []);

  const handleQuantityChange = (productId, quantity) => {
    setQuantities(prevState => ({
      ...prevState,
      [productId]: quantity
    }));
  };

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

    const quantity = quantities[product.product_id] || 1;
    console.log(`Adding ${quantity} ${product.name} to cart`);

    try {
      const cartItem = await axios.post('http://localhost:3000/api/cart', {
        product_id: product.product_id,
        quantity,
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
    const reviews = await getAllReviewsForProduct(productId);
    setReviewCounts(prevState => ({
      ...prevState,
      [productId]: reviews.length
    }));
    setShowReviewForm(prevState => ({
      ...prevState,
      [productId]: false
    }));
  };

  return (
    <div className="box bg-F7B787">
      <div className="bg-green-600 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Special Deals</h1>
      </div>
      <div className="bg-red-500 text-white py-2">
        <h1 className="text-2xl font-semibold text-center">50% Off Buy Now! </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-center mt-8 px-4">
        {specialDeals.length === 0 ? (
          <p className="text-center text-gray-700">Loading...</p>
        ) : (
          specialDeals.map((product) => (
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
