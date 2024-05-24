import React, { useState, useEffect } from 'react';

function Profile() {
  // State to hold user details
  const [userDetails, setUserDetails] = useState(null);
  // State to hold date of joining
  const [dateOfJoining, setDateOfJoining] = useState('');
  // State to track if user is editing profile
  const [isEditing, setIsEditing] = useState(false);
  // State to hold edited user details
  const [editedUser, setEditedUser] = useState(null);
  // State to show success message after saving changes
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  // State to hold confirm password
  const [confirmPassword, setConfirmPassword] = useState('');




  useEffect(() => {
    // Retrieve user details from localStorage
    const storedUserDetails = localStorage.getItem('userDetails');
    if (storedUserDetails) {
      const userData = JSON.parse(storedUserDetails);
      setUserDetails(userData);
      setDateOfJoining(userData.dateOfJoining);
    }

  }, []);
  
  // Function to clear shopping cart
  const clearShoppingCart = () => {
    localStorage.removeItem('cart');
  };

  // Function to handle logout
  const handleLogout = () => {
    clearShoppingCart();
    localStorage.removeItem('sessionToken'); 
    window.location.href = '/'; // Redirect to homepage
  };

  // Function to handle edit profile
  const handleEdit = () => {
    setIsEditing(true);
    // Initialize editedUser with current userDetails
    setEditedUser({ ...userDetails});
  };

  // Function to handle changes in input fields
  const handleChange = (e) => {
    const { name, value } = e.target;
      // Update editedUser with the changed values for user details
      setEditedUser({ ...editedUser, [name]: value });
    }
  
  // Function to handle changes in confirm password field
  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  // Function to save changes
  const handleSave = () => {
    
    // Validate password and confirm password
    if (editedUser.password !== confirmPassword) {
    alert("Passwords don't match. Please enter matching passwords.");
    return;
    }

    // Update userDetails with editedUser
    setUserDetails(editedUser);
  
    // Update localStorage with edited user details
    localStorage.setItem('userDetails', JSON.stringify(editedUser));
    console.log('User details saved to localStorage:', editedUser);

    // Update the users array in localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = users.map(user =>
      user.email === editedUser.email ? editedUser : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));    

    // Show success message
    setShowSuccessMessage(true);
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  
    // Reset editing state
    setIsEditing(false);
  };
  
  
  // Function to handle account deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      // Remove user details from localStorage
      clearShoppingCart();
      localStorage.removeItem('userDetails');

      // Remove diet plan from localStorage
      localStorage.removeItem('dietPlan');
  
      // Remove user from the list of users in localStorage
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const updatedUsers = users.filter(user => user.email !== userDetails.email);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
  
      handleLogout(); // Logout user after deletion
    }
  };
  
  // If user is not logged in, redirect to sign in page
  if (!localStorage.getItem('sessionToken')) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sign in to view profile</h1>
          <button onClick={() => window.location.href = '/sign-in'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </div>
      </div>
    );
  }

  // If userDetails is not yet loaded, show loading message
  if (!userDetails) {
    return <div>Loading...</div>;
  }

  
  // Render profile information
  return (

      <div className="flex justify-center items-center h-screen">
        <div className="max-w-md p-8 bg-white rounded-lg shadow-lg text-center">
          {showSuccessMessage && ( 
            <div className="success-message">
              Your changes have been saved successfully!
            </div>
            
          )}
          {isEditing ? (
            
            <div>
              <div className="flex flex-col space-y-2">
              <label className="block text-sm font-bold mb-2 text-gray-1000">Name:</label>
              <input type="text" name="name" value={editedUser.name} onChange={handleChange} className="input-field" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">Email:</label>
              <input type="email" name="email" value={editedUser.email} onChange={handleChange} className="input-field" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">Password:</label>
              <input type="password" name="password" value={editedUser.password} onChange={handleChange} className="input-field"/>

              <label className="block text-sm font-bold mb-2 text-gray-1000">Confirm Password:</label>
              <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className="input-field"/>
      
                <label className="block text-sm font-bold mb-2 text-gray-1000">Age:</label>
                <input type="number" name="age" value={editedUser.age} onChange={handleChange} className="input-field" />
      
                <label className="block text-sm font-bold mb-2 text-gray-1000">Weight:</label>
                <input type="number" name="weight" value={editedUser.weight} onChange={handleChange} className="input-field" />
      
                <label className="block text-sm font-bold mb-2 text-gray-1000">Height:</label>
                <input type="number" name="height" value={editedUser.height} onChange={handleChange} className="input-field" />
                
                <label className="block text-sm font-bold mb-2 text-gray-1000">Activity Level:</label>
                <input type="text" name="activityLevel" value={editedUser.activityLevel} onChange={handleChange} className="input-field" />
                
                <label className="block text-sm font-bold mb-2 text-gray-1000">Dietary Preferences:</label>
                <input type="text" name="dietaryPreferences" value={editedUser.dietaryPreferences} onChange={handleChange} className="input-field" />
      
                <label className="block text-sm font-bold mb-2 text-gray-1000">Health Goals:</label>
                <input type="text" name="healthGoals" value={editedUser.healthGoals} onChange={handleChange} className="input-field" />
              </div>
              <div className="flex justify-around mt-4">
              <button onClick={handleSave} className="btn-primary">Save</button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <p className="text-2xl mb-4"><strong>Hello, {userDetails.name}!</strong></p>
              <p className="text-lg mb-2"><strong>Email:</strong> {userDetails.email}</p>
              <p className="text-lg mb-2"><strong>Date of Joining:</strong> {dateOfJoining}</p>
              <p className="text-lg mb-2"><strong>Age:</strong> {userDetails.age}</p>
              <p className="text-lg mb-2"><strong>Weight:</strong> {userDetails.weight} kg</p>
              <p className="text-lg mb-2"><strong>Height:</strong> {userDetails.height} cm</p>
              <p className="text-lg mb-2"><strong>Activity Levels:</strong> {userDetails.activityLevel}</p>
              <p className="text-lg mb-2"><strong>Dietary Preferences:</strong> {userDetails.dietaryPreferences}</p>
              <p className="text-lg mb-2"><strong>Health Goals:</strong> {userDetails.healthGoals}</p>
              <div className="btn-group flex justify-around mt-4">
                <button onClick={handleEdit} className="btn-primary">Edit</button>
                <button onClick={handleDelete} className="btn-secondary">Delete Account</button>
                <button onClick={handleLogout} className="btn-secondary">Logout</button>
              </div>
            </div>
          )}
        </div>
      </div>
      ); 
          
    };

export default Profile;