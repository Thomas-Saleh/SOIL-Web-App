import React from 'react';

function VegetableTips() {
  return (
    <div>
    <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Vegetable Tips</h1>
      </div>
    <div className="vegetable-tips-container">
      <img src="/Plant.jpg" alt="SOIL Organic Food Grocer" className="image-container" />
      <div className="tips-overlay w-1/3 text-black">
        <h2 className="text-2xl font-semibold mb-4">Here are some Tips and Tricks for Growing Small Vegetables in Your Backyard:</h2>
        <ul className="list-disc pl-6">
          <li>Select an appropriate spot for your vegetable garden that receives sufficient sunlight.</li>
          <li>If you have limited space, think about using raised beds or containers.</li>
          <li>Choose your vegetables wisely. Some love direct sunlight whilst others prefer shade.</li>
          <li>Ensure you are regularly watering and fertilizing to promote healthy growth of your plants.</li>
          <li>Make sure to not drown your veggie plants, it shouldn't be too soggy.</li>
          <li>Keep up with hygiene to prevent pests and diseases from ruining your vegetables.</li>
          <li>Harvest your vegetables at the right time, not too early not too late encourage ongoing production.</li>
        </ul>
      </div>
    </div>
    </div>





  );
}

export default VegetableTips;