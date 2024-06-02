import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import { verifyUser, getUser, setUser } from '../data/repository'; // Import functions for user verification and management
import { decodeJWT } from '../utils/jwtUtils'; // Import utility to decode JWT tokens

function SignIn() {
  // State variables to manage login details, login status, and error messages
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');
  const navigate = useNavigate(); // Initialize navigate for redirecting users

  // useEffect to check for existing session token on component mount
  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      const user = getUser();
      if (user) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  // Handle input changes and update login details state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  // Handle form submission for login
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await verifyUser(loginDetails.email, loginDetails.password);
      if (response && response.token) {
        localStorage.setItem('sessionToken', response.token); // Store session token
        const decodedToken = decodeJWT(response.token); // Decode JWT token
        setUser(decodedToken); // Set user data
        setIsLoggedIn(true);
        setLoginError('');
        alert('Login successful! You are now logged in.'); // Popup success message
        navigate('/'); // Redirect to homepage
      } else {
        setLoginError('Invalid email or password.');
      }
    } catch (error) {
      setLoginError('Invalid email or password.');
    }
  };

  // Handle user logout
  const handleLogout = () => {
    localStorage.removeItem('sessionToken'); // Remove session token
    setIsLoggedIn(false);
  };

  // Render welcome message if user is logged in
  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold">Welcome back!</h2>
          <p>You are now logged in.</p>
          <button onClick={handleLogout} className="mt-4 px-4 py-2 bg-[#527853] text-white rounded-lg hover:bg-[#EE7214]">Logout</button>
        </div>
      </div>
    );
  }

  // Render sign-in form if user is not logged in
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F9E8D9]">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <h5 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h5>
          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
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
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label>
            <input 
              type="password" 
              name="password" 
              id="password" 
              placeholder="••••••••" 
              className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" 
              required 
              onChange={handleInputChange}
            />
          </div>
          <button 
            type="submit" 
            className="w-full text-white bg-[#527853] hover:bg-[#EE7214] focus:ring-4 focus:outline-none focus:ring-[#EE7214] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#527853] dark:hover:bg-[#EE7214] dark:focus:ring-[#EE7214]"
          >
            Login to your account
          </button>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-300">
            Not registered? <Link to="/sign-up" className="text-[#EE7214] hover:underline dark:text-[#EE7214]">Create account</Link>
          </div>
          {loginError && <div className="text-red-500 text-sm">{loginError}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignIn;
