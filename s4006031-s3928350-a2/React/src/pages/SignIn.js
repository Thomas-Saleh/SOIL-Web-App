import React, { useState, useEffect } from 'react';
import { verifyUser, getUser, setUser } from '../data/repository'; 

function SignIn() {
  const [loginDetails, setLoginDetails] = useState({
    email: '',
    password: '',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      const user = getUser();
      if (user) {
        setIsLoggedIn(true);
      }
    }
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setLoginDetails({ ...loginDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const user = await verifyUser(loginDetails.email, loginDetails.password);
      if (user) {
        localStorage.setItem('sessionToken', 'your_generated_token');
        setUser(user); // Store user details in localStorage
        setIsLoggedIn(true);
        setLoginError('');
      } else {
        setLoginError('Invalid email or password.');
      }
    } catch (error) {
      setLoginError('Invalid email or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sessionToken');
    setIsLoggedIn(false);
  };

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

  return (
    <div>
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Sign In</h1>
      </div>
      <div className="signin-container">
        <div className="signin-background"></div>
        <form onSubmit={handleSubmit} className="signin-form">
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            onChange={handleInputChange}
            className="signin-input"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            onChange={handleInputChange}
            className="signin-input"
          />
          <button type="submit" className="signin-button">Sign In</button>
          {loginError && <div className="error-message">{loginError}</div>}
        </form>
      </div>
    </div>
  );
}

export default SignIn;
