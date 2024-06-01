const jwt = require('jsonwebtoken');
const secret = 'your_secret_key_here'; // Replace with your actual secret key

exports.decodeJWT = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
};
