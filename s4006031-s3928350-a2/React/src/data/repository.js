import axios from "axios";

// --- Constants ----------------------------------------------------------------------------------
const API_HOST = "http://localhost:3000";
const USER_KEY = "users";

// --- User ---------------------------------------------------------------------------------------
async function verifyUser(email, password) {
  const response = await axios.post(API_HOST + "/api/users/login", { email, password });
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
  setUser, getUser, removeUser, deleteUser
};
