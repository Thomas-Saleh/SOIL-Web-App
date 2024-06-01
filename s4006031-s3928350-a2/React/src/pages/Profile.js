import React, { useState, useEffect } from 'react';
import { findUser, updateUser, deleteUser } from '../data/repository';
import { decodeJWT } from '../utils/jwtUtils';

const activityLevels = ['light', 'moderate', 'active', 'very active'];
const dietaryPreferences = ['vegan', 'vegetarian', 'pescatarian', 'dairy free', 'carnivore diet'];
const healthGoals = ['weight loss', 'muscle gain', 'maintenance', 'sleep 7 to 9 hours', 'eat nutritiously'];

function Profile() {
  const [userDetails, setUserDetails] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      const decodedToken = decodeJWT(sessionToken);
      if (decodedToken) {
        fetchUserDetails(decodedToken.user_id);
      }
    }
  }, []);

  const fetchUserDetails = async (userId) => {
    try {
      const user = await findUser(userId);
      if (user && user.email) {
        setUserDetails(user);
      } else {
        console.error('User not found or incomplete user data:', user);
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const clearShoppingCart = () => {
    localStorage.removeItem('cart');
  };

  const handleLogout = () => {
    clearShoppingCart();
    localStorage.removeItem('sessionToken');
    window.location.href = '/'; // Redirect to homepage
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedUser({ ...userDetails, password: '' });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedUser({ ...editedUser, [name]: value });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSave = async () => {
    if (editedUser.password && editedUser.password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await updateUser(editedUser);
      setUserDetails(editedUser);
      setIsEditing(false);

      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error saving user details:', error);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account?')) {
      try {
        await deleteUser(userDetails.id);
        clearShoppingCart();
        handleLogout();
      } catch (error) {
        console.error('Error deleting user account:', error);
      }
    }
  };

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

  if (!userDetails) {
    return <div>Loading...</div>;
  }

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
              <input type="text" name="username" value={editedUser.username} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">Email:</label>
              <input type="email" name="email" value={editedUser.email} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">New Password:</label>
              <input type="password" name="password" value={editedUser.password || ''} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" />

              {editedUser.password && (
                <>
                  <label className="block text-sm font-bold mb-2 text-gray-1000">Confirm Password:</label>
                  <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className="input-field border border-gray-300 rounded px-3 py-2" />
                </>
              )}

              <label className="block text-sm font-bold mb-2 text-gray-1000">Age:</label>
              <input type="number" name="age" value={editedUser.age} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">Weight:</label>
              <input type="number" name="weight" value={editedUser.weight} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">Height:</label>
              <input type="number" name="height" value={editedUser.height} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" />

              <label className="block text-sm font-bold mb-2 text-gray-1000">Activity Level:</label>
              <select name="activity_level" value={editedUser.activity_level || ''} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" >
                <option value="" disabled>Select your activity level</option>
                {activityLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>

              <label className="block text-sm font-bold mb-2 text-gray-1000">Dietary Preferences:</label>
              <select name="dietary_preferences" value={editedUser.dietary_preferences || ''} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" >
                <option value="" disabled>Select your dietary preference</option>
                {dietaryPreferences.map(preference => (
                  <option key={preference} value={preference}>{preference}</option>
                ))}
              </select>

              <label className="block text-sm font-bold mb-2 text-gray-1000">Health Goals:</label>
              <select name="health_goals" value={editedUser.health_goals || ''} onChange={handleChange} className="input-field border border-gray-300 rounded px-3 py-2" >
                <option value="" disabled>Select your health goal</option>
                {healthGoals.map(goal => (
                  <option key={goal} value={goal}>{goal}</option>
                ))}
              </select>
              
            </div>
            <div className="flex justify-around mt-4">
              <button onClick={handleSave} className="btn-primary">Save</button>
              <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="text-2xl mb-4"><strong>Hello, {userDetails.username}!</strong></p>
            <p className="text-lg mb-2"><strong>Email:</strong> {userDetails.email}</p>
            <p className="text-lg mb-2"><strong>Date of Joining:</strong> {formatDate(userDetails.createdAt)}</p>
            <p className="text-lg mb-2"><strong>Age:</strong> {userDetails.age}</p>
            <p className="text-lg mb-2"><strong>Weight:</strong> {userDetails.weight} kg</p>
            <p className="text-lg mb-2"><strong>Height:</strong> {userDetails.height} cm</p>
            <p className="text-lg mb-2"><strong>Activity Levels:</strong> {userDetails.activity_level}</p>
            <p className="text-lg mb-2"><strong>Dietary Preferences:</strong> {userDetails.dietary_preferences}</p>
            <p className="text-lg mb-2"><strong>Health Goals:</strong> {userDetails.health_goals}</p>
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
}

export default Profile;
