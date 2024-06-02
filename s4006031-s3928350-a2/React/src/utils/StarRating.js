import React from 'react';

const StarRating = ({ rating }) => {
  const fullStar = '★'; // Unicode full star
  const emptyStar = '☆'; // Unicode empty star

  return (
    <div>
      {[...Array(5)].map((_, index) => (
        <span key={index} style={{ color: index < rating ? '#FFD700' : '#d3d3d3' }}>
          {index < rating ? fullStar : emptyStar}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
