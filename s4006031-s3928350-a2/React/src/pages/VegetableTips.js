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
          
        </ul>
      </div>
    </div>
    </div>





  );
}

export default VegetableTips;