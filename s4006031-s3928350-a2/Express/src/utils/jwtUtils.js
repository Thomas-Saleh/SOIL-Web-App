// Import the jsonwebtoken library
const jwt = require('jsonwebtoken');

// Define your secret key for JWT decoding
const secret = 'your_secret_key_here'; // Replace with your actual secret key

// Export a function to decode a JWT token
exports.decodeJWT = (token) => {
  try {
    // Decode the JWT token using the secret key
    return jwt.verify(token, secret);
  } catch (error) {
    // If decoding fails, log the error and return null
    console.error('Failed to decode JWT:', error);
    return null;
  }
};
