import React, { useEffect, useState, useCallback } from 'react';
import { getAllReviewsForProduct, deleteReview } from '../data/repository';
import ReviewForm from './ReviewForm';
import { decodeJWT } from '../utils/jwtUtils';

function ReviewList({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [userId, setUserId] = useState(null);

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
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      const decodedToken = decodeJWT(sessionToken);
      setUserId(decodedToken.user_id);
    }
  }, [fetchReviews]);

  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  const handleReviewAdded = () => {
    fetchReviews();
    setEditingReview(null); // Reset the editingReview state after review is added/edited
  };

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
            {review.user_id === userId && (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                  onClick={() => setEditingReview(review)}
                >
                  Edit
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                  onClick={() => handleDelete(review.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))
      )}
      {editingReview && (
        <ReviewForm
          productId={productId}
          onReviewAdded={handleReviewAdded}
          existingReview={editingReview}
        />
      )}
    </div>
  );
}

export default ReviewList;
