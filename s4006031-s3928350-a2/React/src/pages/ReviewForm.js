import React, { useState, useEffect } from 'react';
import { addReview, updateReview } from '../data/repository'; // Importing functions to add or update reviews
import { decodeJWT } from '../utils/jwtUtils'; // Importing JWT decoding function
import StarRating from '../utils/StarRating'; // Importing StarRating component

function ReviewForm({ productId, onReviewAdded, existingReview }) {
  // State variables to manage review text, star rating, and editing status
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  // Effect to populate form fields if editing an existing review
  useEffect(() => {
    if (existingReview) {
      setReviewText(existingReview.review_text);
      setStarRating(existingReview.star_rating);
      setIsEditing(true);
    }
  }, [existingReview]);

  // Event handlers to update review text and star rating
  const handleReviewTextChange = (e) => setReviewText(e.target.value);
  const handleStarRatingChange = (e) => setStarRating(parseInt(e.target.value));

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionToken = localStorage.getItem('sessionToken'); // Retrieve session token from local storage
    if (!sessionToken) {
      alert('You must be logged in to submit a review.'); // Alert user if not logged in
      return;
    }

    const decodedToken = decodeJWT(sessionToken); // Decode JWT to get user ID
    const userId = decodedToken.user_id;

    const reviewData = { // Construct review data object
      user_id: userId,
      product_id: productId,
      review_text: reviewText,
      star_rating: starRating,
    };

    try {
      if (isEditing) {
        await updateReview(existingReview.id, reviewData); // Update review if editing existing review
      } else {
        await addReview(reviewData); // Add new review if not editing
      }
      onReviewAdded(); // Callback function to notify parent component of review addition/update
      setReviewText(''); // Reset review text
      setStarRating(1); // Reset star rating
      setIsEditing(false); // Reset editing status
    } catch (error) {
      console.error('Failed to create review:', error); // Log error if review creation fails
      alert('Failed to create review.'); // Alert user if review creation fails
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold text-gray-800">{isEditing ? 'Edit Review' : 'Leave a Review'}</h3>
      <textarea
        value={reviewText}
        onChange={handleReviewTextChange}
        placeholder="Write your review here..."
        className="w-full border border-gray-300 rounded p-2 mt-2"
        maxLength="100" // Enforce max length of 100 characters
        required
      />
      <div className="mt-2">
        <label htmlFor="starRating" className="block text-gray-800">Star Rating:</label>
        <StarRating rating={starRating} /> {/* Display star rating component */}
        <select
          id="starRating"
          value={starRating}
          onChange={handleStarRatingChange}
          className="border border-gray-300 rounded p-1"
          required
        >
          {[1, 2, 3, 4, 5].map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4">
        {isEditing ? 'Update Review' : 'Submit Review'} {/* Button text based on editing status */}
      </button>
    </form>
  );
}

export default ReviewForm;
