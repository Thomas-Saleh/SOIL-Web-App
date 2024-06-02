// Import the React library
import React from 'react';

// Define a functional component named StarRating
const StarRating = ({ rating }) => {
  // Define Unicode characters for full and empty stars
  const fullStar = '★'; // Unicode full star
  const emptyStar = '☆'; // Unicode empty star

  // Return the JSX for rendering the star rating
  return (
    <div>
      {/* Use Array(5) to create an array of length 5 and map over it */}
      {[...Array(5)].map((_, index) => (
        // Render a span for each star, applying appropriate color based on the rating
        <span key={index} style={{ color: index < rating ? '#FFD700' : '#d3d3d3' }}>
          {/* Render a full or empty star based on the index and rating */}
          {index < rating ? fullStar : emptyStar}
        </span>
      ))}
    </div>
  );
};

// Export the StarRating component as default
export default StarRating;
