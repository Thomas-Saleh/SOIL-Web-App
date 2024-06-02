import React, { useState } from 'react';
import { createUser } from '../data/repository';  // Import createUser function from repository
import { useNavigate, Link } from 'react-router-dom'; // Import useNavigate for navigation and Link for routing

function Signup() {
  // State variables to manage user details and error messages
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate(); // Initialize navigate for redirecting users

  // Handle input changes and update user details state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Handle form submission for signup
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await createUser(userDetails); // Create user using userDetails
        if (response) {
          alert('Registration successful! Redirecting to the sign-in page.'); // Popup success message
          navigate('/sign-in'); // Redirect to the sign-in page immediately
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setErrorMessage('Email is already in use. Please try again.'); // Handle email conflict error
        } else {
          setErrorMessage(error.response?.data?.message || 'Failed to register. Please try again.'); // Handle other errors
        }
      }
    }
  };

  // Validate form input
  const validateForm = () => {
    if (!userDetails.username || !userDetails.email || !userDetails.password) {
      setErrorMessage('All fields are required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      setErrorMessage('You must enter a valid email address.');
      return false;
    }
    if (userDetails.password.length < 8) {
      setErrorMessage('Your password must be at least 8 characters long.');
      return false;
    }
    if (!/[A-Z]/.test(userDetails.password)) {
      setErrorMessage('Your password must contain at least one uppercase letter.');
      return false;
    }
    if (!/\d/.test(userDetails.password)) {
      setErrorMessage('Your password must contain at least one number.');
      return false;
    }
    if (userDetails.password !== userDetails.confirmPassword) {
      setErrorMessage('Password and Confirm Password must match.');
      return false;
    }
    setErrorMessage('');
    return true;
  };

  // Render signup form
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9E8D9]">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign up for our platform</h5>
          <div>
            <label htmlFor="username" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
            <input 
              type="text" 
              name="username" 
              id="username" 
              className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              placeholder="Your username" 
              required 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
            <input 
              type="email" 
              name="email" 
              id="email" 
              className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              placeholder="name@company.com" 
              required 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              placeholder="••••••••" 
              required 
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword" 
              id="confirmPassword" 
              className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              placeholder="••••••••" 
              required 
              onChange={handleInputChange}
            />
          </div>
          <button 
            type="submit" 
            className="w-full text-white bg-[#527853] hover:bg-[#EE7214] focus:ring-4 focus:outline-none focus:ring-[#EE7214] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#527853] dark:hover:bg-[#EE7214] dark:focus:ring-[#EE7214]"
          >
            Sign Up
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Already have an account? <Link to="/sign-in" className="text-[#EE7214] hover:underline dark:text-[#EE7214]">Sign In</Link>
          </div>
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>} {/* Display error message if any */}
        </form>
      </div>
    </div>
  );
}

export default Signup;
