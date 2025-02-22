import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:3000";
const USER_KEY = "users";

// --- User ---------------------------------------------------------------------------------------

async function verifyUser(email, password) {
  const response = await axios.post(API_HOST + "/api/users/login", { email, password });
  const token = response.data.token;
  localStorage.setItem('sessionToken', token);
  return response.data;
}

async function findUser(id) {
  const response = await axios.get(API_HOST + `/api/users/${id}`);
  return response.data;
}

async function createUser(user) {
  const response = await axios.post(API_HOST + "/api/users", user);
  return response.data;
}

async function updateUser(user) {
  const response = await axios.put(API_HOST + `/api/users/${user.id}`, user);
  return response.data;
}

async function deleteUser(userId) {
  const response = await axios.delete(API_HOST + `/api/users/${userId}`);
  return response.data;
}

// --- Products ---------------------------------------------------------------------------------------


// --- Special Deals ------------------------------------------------------------------------------
async function getSpecialDeals() {
  const response = await axios.get(API_HOST + "/api/products/special-deals");
  return response.data;
}

async function setSpecialDeals(specialDeals) {
  const response = await axios.post(API_HOST + "/api/products/special-deals", { specialDeals });
  return response.data;
}

// --- Cart ---------------------------------------------------------------------------------------
async function getCartItems(userId) {
  const response = await axios.get(`${API_HOST}/api/cart/${userId}`);
  return response.data;
}

async function addCartItem(cartItem) {
  const response = await axios.post(`${API_HOST}/api/cart`, cartItem);
  return response.data;
}

async function updateCartItem(itemId, newQuantity) {
  const response = await axios.put(`${API_HOST}/api/cart/${itemId}`, { quantity: newQuantity });
  return response.data;
}

async function removeCartItem(itemId) {
  const response = await axios.delete(`${API_HOST}/api/cart/${itemId}`);
  return response.data;
}

async function checkout(userId) {
  const response = await axios.post(`${API_HOST}/api/cart/checkout`, { userId });
  return response.data;
}

async function clearCart(userId) {
  const response = await axios.delete(`${API_HOST}/api/cart/clear`, { data: { userId } });
  return response.data;
}

// --- Reviews ---------------------------------------------------------------------------------
async function getAllReviewsForProduct(productId) {
  const response = await axios.get(`${API_HOST}/api/reviews/product/${productId}`);
  return response.data;
}

async function addReview(reviewData) {
  const response = await axios.post(`${API_HOST}/api/reviews/product/${reviewData.product_id}`, reviewData);
  return response.data;
}

async function updateReview(reviewId, reviewData) {
  const response = await axios.put(`${API_HOST}/api/reviews/${reviewId}`, reviewData);
  return response.data;
}

async function deleteReview(reviewId) {
  const response = await axios.delete(`${API_HOST}/api/reviews/${reviewId}`);
  return response.data;
}
// --- Follow --------------------------------------------
async function followUser(followerId, followingId) {
  const response = await axios.post(API_HOST + "/api/follow", { follower_id: followerId, following_id: followingId });
  return response.data;
}

async function unfollowUser(followerId, followingId) {
  const response = await axios.delete(API_HOST + "/api/follow", { data: { follower_id: followerId, following_id: followingId } });
  return response.data;
}

// --- Helper functions to interact with local storage --------------------------------------------
function setUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function getUser() {
  const user = localStorage.getItem(USER_KEY);
  try {
    return JSON.parse(user);
  } catch (error) {
    console.error("Failed to parse user data from local storage:", error);
    localStorage.removeItem(USER_KEY); // Remove invalid data
    return null;
  }
}

function removeUser() {
  localStorage.removeItem(USER_KEY);
}

export {
  verifyUser, findUser, createUser, updateUser,
  setUser, getUser, removeUser, deleteUser, 
  getSpecialDeals, setSpecialDeals,
  getCartItems, addCartItem, updateCartItem, removeCartItem, checkout, clearCart,
  getAllReviewsForProduct, addReview, updateReview, deleteReview,
  followUser, unfollowUser
};
