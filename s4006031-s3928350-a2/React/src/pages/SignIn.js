import React, { useState, useEffect } from 'react';

function SignIn() {
  // State to hold login details
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // State to hold login error message
  const [loginError, setLoginError] = useState('');


  useEffect(() => {
    // Check if the user is already logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsLoggedIn(true);
    // Load user details from userDetails instead of users array
    const userDetails = localStorage.getItem('userDetails');
        if (userDetails) {
    }
    }
  }, []);

  // Function to handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Retrieve existing users from localStorage
    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    // Find user with provided email and password
    const user = existingUsers.find(
      (user) =>
        user.email === loginDetails.email && user.password === loginDetails.password
    );
    if (user) {
      // Set a session token to indicate the user is logged in
      localStorage.setItem('sessionToken', 'your_generated_token');
      // Store user details in localStorage
      localStorage.setItem('userDetails', JSON.stringify(user));
      setIsLoggedIn(true);
      setLoginError('');
      // window.location.href = '/'; // Redirect to homepage

    } else {
      setLoginError('Invalid email or password.');
    }
  };

  // Function to handle logout
  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    setIsLoggedIn(false);
  };

  // Render logged in message if user is logged in
  if (isLoggedIn) {
    return (
      <div className="loggedin-container">
        <div className="loggedin-message">
          <h2>Welcome back!</h2>
          <p>You are now logged in.</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </div>
    );
  }
  
  // Render sign in form if user is not logged in
  return (
    <div>
    <div className="bg-green-500 text-white py-4">
      <h1 className="text-3xl font-semibold text-center">Sign In</h1>
    </div>

    <div className="signin-container">
        <div className ="signin-background"></div>
      <form onSubmit={handleSubmit} className="signin-form">
        <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className="signin-input"
        />
        <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} className="signin-input"
        />
        <button type="submit" className="signin-button">Sign In</button>
        {loginError && <div className="error-message">{loginError}</div>}
      </form>
    </div>
    </div>
  );
}

export default SignIn
