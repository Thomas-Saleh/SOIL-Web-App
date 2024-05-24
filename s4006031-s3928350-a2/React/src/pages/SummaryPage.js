import React from 'react';

function SummaryPage({ cart }) {
  // Calculate total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Purchase Summary</h1>
      </div>
      <div className="bg-gray-200 p-4">
        {/* Display purchased items with quantities and total price */}
        <ul>
          {cart.map((item, index) => (
            <li key={index} className="bg-gray-200 p-4 flex flex-col items-center justify-between">
              <img src={item.imageUrl} alt={item.name} className="w-32 h-32 rounded-full" />
              <div className="text-center">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <span>Quantity: {item.quantity}</span>
                <span>Total Price: ${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </li>
          ))}
        </ul>
        {/* Total price */}
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
        </div>
        {/* Thank you message */}
        <div className="text-center mt-4 font-bold text-xl">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;