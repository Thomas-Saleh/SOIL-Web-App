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
    <div className="flex justify-center items-center h-screen bg-[#F9E8D9]">
      <div className="w-full max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
        {showSuccessMessage && (
          <div className="success-message text-green-500">Your changes have been saved successfully!</div>
        )}
        {isEditing ? (
          <div>
            <form className="space-y-6" onSubmit={handleSave}>
              <div className="flex flex-col space-y-2">
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Name:</label>
                <input type="text" name="username" value={editedUser.username} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                <input type="email" name="email" value={editedUser.email} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">New Password:</label>
                <input type="password" name="password" value={editedUser.password || ''} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
  
                {editedUser.password && (
                  <>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white">Confirm Password:</label>
                    <input type="password" name="confirmPassword" value={confirmPassword} onChange={handleConfirmPasswordChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
                  </>
                )}
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Age:</label>
                <input type="number" name="age" value={editedUser.age} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Weight:</label>
                <input type="number" name="weight" value={editedUser.weight} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Height:</label>
                <input type="number" name="height" value={editedUser.height} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" />
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Activity Level:</label>
                <select name="activity_level" value={editedUser.activity_level || ''} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" >
                  <option value="" disabled>Select your activity level</option>
                  {activityLevels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Dietary Preferences:</label>
                <select name="dietary_preferences" value={editedUser.dietary_preferences || ''} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" >
                  <option value="" disabled>Select your dietary preference</option>
                  {dietaryPreferences.map(preference => (
                    <option key={preference} value={preference}>{preference}</option>
                  ))}
                </select>
  
                <label className="block text-sm font-medium text-gray-900 dark:text-white">Health Goals:</label>
                <select name="health_goals" value={editedUser.health_goals || ''} onChange={handleChange} className="bg-[#F9E8D9] border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-[#527853] focus:border-[#527853] block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white" >
                  <option value="" disabled>Select your health goal</option>
                  {healthGoals.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-around mt-4">
                <button type="submit" className="w-full text-white bg-[#527853] hover:bg-[#EE7214] focus:ring-4 focus:outline-none focus:ring-[#EE7214] font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-[#527853] dark:hover:bg-[#EE7214] dark:focus:ring-[#EE7214]">Save</button>
                <button onClick={() => setIsEditing(false)} className="w-full text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700">Cancel</button>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-gray-800 dark p-4 rounded-lg shadow-md">
            <div>
              <p className="text-xl mb-4 text-gray-900 dark:text-white"><strong>Welcome {userDetails.username}!</strong></p>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Email:</strong> {userDetails.email}</p>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Health Goals:</strong> {userDetails.health_goals}</p>
            </div>
            <p className="border-t border-gray-200 my-4"></p>
            <div>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Age:</strong> {userDetails.age}</p>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Weight:</strong> {userDetails.weight} kg</p>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Height:</strong> {userDetails.height} cm</p>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Activity Levels:</strong> {userDetails.activity_level}</p>
              <p className="text-sm mb-2 text-gray-900 dark:text-white"><strong>Dietary Preferences:</strong> {userDetails.dietary_preferences}</p>
            </div>
            <div className='flex justify-end '>
              <p className="text-sm mb-2 text-gray-900 dark:text-white mt-8">Date of Joining: {formatDate(userDetails.createdAt)}</p> 
            </div>
            <div className="btn-group flex justify-around mt-4">
              <button onClick={handleEdit} className="w-full text-white bg-[#527853] hover:bg-[#EE7214] focus:ring-4 focus:outline-none focus:ring-[#EE7214] font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-[#527853] dark:hover:bg-[#EE7214] dark:focus:ring-[#EE7214] mx-2">Edit</button>
              <button onClick={handleDelete} className="w-full text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 mx-2">Delete Account</button>
              <button onClick={handleLogout} className="w-full text-white bg-gray-500 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-700 font-medium rounded-lg text-sm px-5 py-2 text-center dark:bg-gray-600 dark:hover:bg-gray-700 dark:focus:ring-gray-700 mx-2">Logout</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Profile;
