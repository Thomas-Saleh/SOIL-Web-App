import React, { useState, useEffect } from 'react';
import { getSpecialDeals, setSpecialDeals, addCartItem, getAllReviewsForProduct } from "../data/repository";
import axios from 'axios';
import { decodeJWT } from '../utils/jwtUtils';
import ReviewForm from './ReviewForm';
import ReviewList from './ReviewList';

function SpecialDeals() {
  const [randomProducts, setRandomProducts] = useState([]);
  const discountRate = 0.4; // 40% discount
  const numOfSpecials = 5;
  const [quantities, setQuantities] = useState({});
  const [showReviewForm, setShowReviewForm] = useState({});
  const [showReviewList, setShowReviewList] = useState({});
  const [reviewCounts, setReviewCounts] = useState({});

  useEffect(() => {
    async function fetchSpecialDeals() {
      try {
        console.log("Fetching special deals...");
        let specialDeals = await getSpecialDeals();
        console.log("Fetched special deals:", specialDeals);

        if (!specialDeals) {
          console.error("Special deals data is null or undefined");
          specialDeals = [];
        }

        if (specialDeals.length === 0) {
          console.log("No special deals found, fetching all products...");
          const response = await axios.get('http://localhost:3000/api/products');
          const products = response.data;
          console.log("Fetched products:", products);

          const shuffledProducts = products.sort(() => Math.random() - 0.5);
          console.log("Shuffled products:", shuffledProducts);

          specialDeals = shuffledProducts.slice(0, numOfSpecials).map(product => {
            const discountedPrice = product.price * (1 - discountRate);
            return { ...product, price: discountedPrice };
          });
          console.log("Special deals with discounts applied:", specialDeals);

          setRandomProducts(specialDeals);

          const dealsWithoutId = specialDeals.map(({ id, ...rest }) => rest);

          console.log("Saving special deals to the database...");
          await setSpecialDeals(dealsWithoutId);
          console.log("Special deals saved to the database.");
        } else {
          setRandomProducts(specialDeals);
          console.log("Setting special deals from database:", specialDeals);
        }

        // Fetch review counts for each product
        const reviewCountsData = {};
        for (const product of specialDeals) {
          const reviews = await getAllReviewsForProduct(product.id);
          reviewCountsData[product.id] = reviews.length;
        }
        setReviewCounts(reviewCountsData);

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

    const user_id = decodedToken.user_id;
    const quantity = quantities[product.name] || 1;
    console.log(`Adding ${quantity} ${product.name} to cart`);

    try {
      const cartItem = await addCartItem({
        user_id,
        product_id: product.id,
        quantity
      });

      console.log("Item added to cart:", cartItem);
      alert(`${product.name} added to cart!`);
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
    <div>
      <div className="bg-green-600 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Special Deals</h1>
      </div>
      <div className="bg-red-500 text-white py-2">
        <h1 className="text-2xl font-semibold text-center">50% Off Buy Now! </h1>
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
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                onClick={() => toggleReviewForm(product.id)}
              >
                Leave a Review
              </button>
              {showReviewForm[product.id] && (
                <ReviewForm productId={product.id} onReviewAdded={() => handleReviewAdded(product.id)} />
              )}
              <button
                className="bg-yellow-500 hover:bg-yellow-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                onClick={() => toggleReviewList(product.id)}
              >
                {`See Reviews (${reviewCounts[product.id] || 0})`}
              </button>
              {showReviewList[product.id] && (
                <ReviewList productId={product.id} />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SpecialDeals;
