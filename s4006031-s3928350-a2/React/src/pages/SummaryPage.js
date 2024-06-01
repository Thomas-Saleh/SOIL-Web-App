import React from 'react';

function SummaryPage({ orderSummary }) {
  // Calculate the total price using the item's price (which could be the special price)
  const totalPrice = orderSummary.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <div>
      <div className="bg-green-500 text-white py-4 mt-4 rounded-lg">
        <h1 className="text-3xl font-semibold text-center">Order Summary</h1>
      </div>
      <div className="text-center mt-4">
        {orderSummary.length === 0 ? (
          <p>No items in the order.</p>
        ) : (
          <ul>
            {orderSummary.map((item, index) => (
              <li key={index} className="bg-gray-200 p-4 flex flex-col items-center justify-between rounded-xl">
                <img src={item.product.imageUrl} alt={item.product.name} className="w-32 h-32 rounded-full" />
                <div className="text-center">
                  <h3 className="text-lg font-semibold">{item.product.name}</h3>
                  <span className='mx-5'>Quantity: {item.quantity}</span>
                  <span className='mx-5'>Total Price: ${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <div className="text-center mt-4">
          <h2 className="text-xl font-semibold">Total: ${totalPrice.toFixed(2)}</h2>
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  );
}

export default SummaryPage;
