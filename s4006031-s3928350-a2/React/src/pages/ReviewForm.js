import React, { useState } from 'react';
import { addReview } from '../data/repository';
import { decodeJWT } from '../utils/jwtUtils';

function ReviewForm({ productId, onReviewAdded }) {
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(1);

  const handleReviewTextChange = (e) => setReviewText(e.target.value);
  const handleStarRatingChange = (e) => setStarRating(parseInt(e.target.value));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sessionToken = localStorage.getItem('sessionToken');
    if (!sessionToken) {
      alert('You must be logged in to submit a review.');
      return;
    }

    const decodedToken = decodeJWT(sessionToken);
    const userId = decodedToken.user_id;

    const reviewData = {
      user_id: userId,
      product_id: productId,
      review_text: reviewText,
      star_rating: starRating,
    };

    console.log('Submitting review:', reviewData);

    try {
      await addReview(reviewData);
      onReviewAdded();
      setReviewText('');
      setStarRating(1);
    } catch (error) {
      console.error('Failed to create review:', error);
      alert('Failed to create review.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold text-gray-800">Leave a Review</h3>
      <textarea
        value={reviewText}
        onChange={handleReviewTextChange}
        placeholder="Write your review here..."
        className="w-full border border-gray-300 rounded p-2 mt-2"
        maxLength="255"
        required
      />
      <div className="mt-2">
        <label className="block text-gray-800">Star Rating:</label>
        <select
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
        Submit Review
      </button>
    </form>
  );
}

export default ReviewForm;
