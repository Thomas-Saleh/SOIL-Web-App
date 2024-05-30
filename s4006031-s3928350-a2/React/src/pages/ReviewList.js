import React, { useEffect, useState, useCallback } from 'react';
import { getAllReviewsForProduct } from '../data/repository';

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = useCallback(async () => {
    try {
      const reviewsData = await getAllReviewsForProduct(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }, [productId]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border border-gray-300 rounded p-2 mt-2">
            <p><strong>{review.star_rating} stars</strong></p>
            <p>{review.review_text}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default ReviewList;
