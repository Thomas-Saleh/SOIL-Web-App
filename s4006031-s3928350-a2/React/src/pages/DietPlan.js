import React, { useState, useEffect } from 'react';

function DietPlan() {
  const [dietaryRestrictions, setDietaryRestrictions] = useState('');
  const [preferredMealTimes, setPreferredMealTimes] = useState('');
  const [calorieGoal, setCalorieGoal] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    // Retrieve diet plan from localStorage
    const storedDietPlan = localStorage.getItem('dietPlan');
    if (storedDietPlan) {
      const dietPlanData = JSON.parse(storedDietPlan);
      // Set state with stored diet plan data
      setDietaryRestrictions(dietPlanData.dietaryRestrictions);
      setPreferredMealTimes(dietPlanData.preferredMealTimes);
      setCalorieGoal(dietPlanData.calorieGoal);
    }
    // Check if the user is logged in
    const sessionToken = localStorage.getItem('sessionToken');
    if (sessionToken) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleEdit = () => {
    // Enable editing mode
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // updates the components with the changed values
    switch (name) {
      case 'dietaryRestrictions':
        setDietaryRestrictions(value);
        break;
      case 'preferredMealTimes':
        setPreferredMealTimes(value);
        break;
      case 'calorieGoal':
        setCalorieGoal(value);
        break;
      default:
        break;
    }
  };

  const handleSave = () => {
    // Construct diet plan object
    const dietPlan = {
      dietaryRestrictions, preferredMealTimes, calorieGoal,
    };

    // Save diet plan to localStorage
    localStorage.setItem('dietPlan', JSON.stringify(dietPlan));
    
    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
    
    // Disable editing mode
    setIsEditing(false);
  };

  // If user is not logged in, show sign-in prompt
  if (!isLoggedIn) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sign in to view your diet plan</h1>
          <button onClick={() => window.location.href = '/sign-in'} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Sign In
          </button>
        </div>
      </div>
    );
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
        <label className="block text-sm font-bold mb-2 text-gray-1000">Dietary Restrictions:</label>
        <input type="text" name="dietaryRestrictions" value={dietaryRestrictions}   onChange={(e) => setDietaryRestrictions(e.target.value)} className="input-field"/>
                
        <label className="block text-sm font-bold mb-2 text-gray-1000">Preferred Meal Times:</label>
        <input type="text" name="preferredMealTimes" value={preferredMealTimes}   onChange={(e) => setPreferredMealTimes(e.target.value)} className="input-field"/>
                
        <label className="block text-sm font-bold mb-2 text-gray-1000">Calorie Goal:</label>
        <input type="number" name="calorieGoal" value={calorieGoal} onChange={handleChange} className="input-field"/>
        </div>
        <div className="flex justify-around mt-4">
            <button onClick={handleSave} className="btn-primary">Save</button>
            <button onClick={() => setIsEditing(false)} className="btn-secondary">Cancel</button>
        </div>
        </div>
  ) : (
    <div>
        <p className="text-2xl mb-4"><strong>Diet Plan</strong></p>
        <p className="text-lg mb-2"><strong>Dietary Restrictions:</strong> {dietaryRestrictions}</p>
        <p className="text-lg mb-2"><strong>Preferred Meal Times:</strong> {preferredMealTimes}</p>
        <p className="text-lg mb-2"><strong>Calorie Goal:</strong> {calorieGoal}</p>
        <div className="btn-group flex justify-around mt-4">
            <button onClick={handleEdit} className="btn-primary">Edit</button>
        </div>
    </div>
  )}
  </div>
  </div>
); }
export default DietPlan;