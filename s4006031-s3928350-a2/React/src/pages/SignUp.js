import React, { useState } from 'react';
import { createUser } from '../data/repository';  
import { useNavigate } from 'react-router-dom';

function Signup() {
  const [userDetails, setUserDetails] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      try {
        const response = await createUser(userDetails);
        if (response) {
          setIsSubmitted(true);
          setTimeout(() => {
            navigate('/sign-in');
          }, 2000);
        }
      } catch (error) {
        if (error.response?.status === 409) {
          setErrorMessage('Email is already in use. Please try again.');
        } else {
          setErrorMessage(error.response?.data?.message || 'Failed to register. Please try again.');
        }
      }
    }
  };

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

  const renderSuccessMessage = () => {
    return (
      <div className="success-message">
        Registration successful! You will be redirected to the sign-in page shortly.
      </div>
    );
  };

  return (
    <div>
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Sign Up</h1>
      </div>
      <div className="signin-container">
        <div className="signin-background"></div>
        {isSubmitted ? (
          renderSuccessMessage()
        ) : (
          <form onSubmit={handleSubmit} className="signin-form">
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              onChange={handleInputChange}
              className="signin-input"
            />
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
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleInputChange}
              className="signin-input"
            />
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <button type="submit" className="signin-button">Sign Up</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Signup;
