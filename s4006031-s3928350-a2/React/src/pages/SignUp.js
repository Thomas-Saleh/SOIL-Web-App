import React, { useState } from 'react';

function Signup() {
  // State to hold user details
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  
  // State to track if the form is submitted
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Function to handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails({ ...userDetails, [name]: value });
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    // Validate the form
    if (validateForm()) {
      // Check if the email already exists in localStorage
      const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
      const existingUser = existingUsers.find(
        (user) => user.email === userDetails.email
      );
      if (existingUser) {
        alert('This email is already registered. Please use a different email.');
        return;
      }
  
      // Get the current date
      const dateOfJoining = new Date().toLocaleDateString();
      // Add the date of joining to the user details
      const userDataWithDate = { ...userDetails, dateOfJoining };
  
      // Save the user details to localStorage
      localStorage.setItem('users', JSON.stringify([...existingUsers, userDataWithDate]));
  
      // Set the submitted state to true
      setIsSubmitted(true);
    }
  };
  
  
  // Function to validate the form
  const validateForm = () => {
    // Check if all fields are filled
    if (!userDetails.name || !userDetails.email || !userDetails.password) {
      alert('All fields are required.');
      return false;
    }
    // Validate email format
    if (!/\S+@\S+\.\S+/.test(userDetails.email)) {
      alert('You must enter a valid email address.');
      return false;
    }
    // Check for strong password
    if (userDetails.password.length < 8) {
      alert('Your password must be at least 8 characters long.');
      return false;
    }
    // Check if password contains at least one uppercase letter
    if (!/[A-Z]/.test(userDetails.password)) {
      alert('Your password must contain at least one uppercase letter.');
      return false;
    }
    // Check if password contains at least one number
    if (!/\d/.test(userDetails.password)) {
      alert('Your password must contain at least one number.');
      return false;
    }
    // Check if password matches confirm password
    if (userDetails.password !== userDetails.confirmPassword) {
      alert('Password and Confirm Password must match.');
      return false;
    }
    return true;
  };

  // Display a success message if the form was submitted successfully
  const renderSuccessMessage = () => {
    return (
      <div className="success-message">
        Registration successful! You can now sign in.
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
          <input type="text" name="name" placeholder="Name" required onChange={handleInputChange} className="signin-input"/>
          <input type="email" name="email" placeholder="Email" required onChange={handleInputChange} className="signin-input"/>
          <input type="password" name="password" placeholder="Password" required onChange={handleInputChange} className="signin-input"/>
          <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleInputChange} className="signin-input" />
          <button type="submit" className="signin-button">Sign Up</button>
        </form>
      )}
    </div>
    </div>
  );
}

export default Signup
