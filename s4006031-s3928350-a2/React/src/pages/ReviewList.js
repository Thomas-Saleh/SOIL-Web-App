import React, { useEffect, useState, useCallback } from 'react';
import { getAllReviewsForProduct, deleteReview, followUser, unfollowUser } from '../data/repository'; // Importing functions for review management
import ReviewForm from './ReviewForm'; // Importing ReviewForm component
import { decodeJWT } from '../utils/jwtUtils'; // Importing JWT decoding function
import StarRating from '../utils/StarRating'; // Importing StarRating component

function ReviewList({ productId }) {
  // State variables to manage reviews, editing review, user ID, and user's review
  const [reviews, setReviews] = useState([]);
  const [editingReview, setEditingReview] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userReview, setUserReview] = useState(null); // Store user's review

  // Function to fetch reviews for the current product
  const fetchReviews = useCallback(async () => {
    try {
      const reviewsData = await getAllReviewsForProduct(productId);
      setReviews(reviewsData);

      // Check if the user has already reviewed the product
      const sessionToken = localStorage.getItem('sessionToken');
      if (sessionToken) {
        const decodedToken = decodeJWT(sessionToken);
        const userId = decodedToken.user_id;
        setUserId(userId);

        const userReview = reviewsData.find(review => review.user_id === userId);
        setUserReview(userReview);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    }
  }, [productId]);

  // Effect to fetch reviews when component mounts or productId changes
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  // Function to handle deletion of a review
  const handleDelete = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      setReviews(reviews.filter(review => review.id !== reviewId)); // Update state immediately
    } catch (error) {
      console.error('Failed to delete review:', error);
    }
  };

  // Callback function to handle review addition or editing
  const handleReviewAdded = () => {
    fetchReviews(); // Fetch reviews after addition or editing
    setEditingReview(null); // Reset the editingReview state after review is added/edited
  };

  // Function to handle following a user
  const handleFollow = async (followingId) => {
    try {
      await followUser(userId, followingId);
      alert("User followed successfully!");
    } catch (error) {
      console.error('Failed to follow user:', error);
    }
  };

  // Function to handle unfollowing a user
  const handleUnfollow = async (followingId) => {
    try {
      await unfollowUser(userId, followingId);
      alert("User unfollowed successfully!");
    } catch (error) {
      console.error('Failed to unfollow user:', error);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-semibold text-gray-800">Reviews</h3>
      {reviews.length === 0 ? (
        <p>No reviews yet.</p>
      ) : (
        reviews.map((review) => (
          <div key={review.id} className="border border-gray-300 rounded p-2 mt-2">
            <StarRating rating={review.star_rating} /> {/* Display star rating component */}
            <p><strong>{review.user.username}</strong></p>
            <p>{review.review_text}</p>
            {review.user_id !== userId && (
              <>
                <button
                  className="bg-blue-500 hover:bg-blue-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                  onClick={() => handleFollow(review.user_id)}
                >
                  Follow
                </button>
                <button
                  className="bg-red-500 hover:bg-red-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4"
                  onClick={() => handleUnfollow(review.user_id)}
                >
                  Unfollow
                </button>
              </>
            )}
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
      {(!userReview || editingReview) && (
        <ReviewForm
          productId={productId}
          onReviewAdded={handleReviewAdded}
          existingReview={editingReview || userReview}
        />
      )}
    </div>
  );
}

export default ReviewList;
