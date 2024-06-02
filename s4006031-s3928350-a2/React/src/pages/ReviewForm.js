import React, { useState, useEffect } from 'react';
import { addReview, updateReview } from '../data/repository';
import { decodeJWT } from '../utils/jwtUtils';
import StarRating from '../utils/StarRating';

function ReviewForm({ productId, onReviewAdded, existingReview }) {
  const [reviewText, setReviewText] = useState('');
  const [starRating, setStarRating] = useState(1);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (existingReview) {
      setReviewText(existingReview.review_text);
      setStarRating(existingReview.star_rating);
      setIsEditing(true);
    }
  }, [existingReview]);

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

    try {
      if (isEditing) {
        await updateReview(existingReview.id, reviewData);
      } else {
        await addReview(reviewData);
      }
      onReviewAdded();
      setReviewText('');
      setStarRating(1);
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to create review:', error);
      alert('Failed to create review.');
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
        <StarRating rating={starRating} />
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
        {isEditing ? 'Update Review' : 'Submit Review'}
      </button>
    </form>
  );
}

export default ReviewForm;
