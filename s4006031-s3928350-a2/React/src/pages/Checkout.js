import React, { useState } from 'react';
import { checkout, clearCart } from '../data/repository'; // Import the repository functions
import SummaryPage from './SummaryPage'; // Import the SummaryPage component
import { decodeJWT } from '../utils/jwtUtils'; // Import the custom decode function

function Checkout({ cart }) {
  // State to manage credit card number input
  const [creditCardNumber, setCreditCardNumber] = useState('');
  // State to manage expiry date input
  const [expiryDate, setExpiryDate] = useState('');
  // State to manage error messages
  const [errorMessage, setErrorMessage] = useState('');
  // State to manage purchase success status
  const [isPurchaseSuccessful, setIsPurchaseSuccessful] = useState(false);
  // State to manage order summary after successful purchase
  const [orderSummary, setOrderSummary] = useState([]);

  // Handler for credit card number input change
  const handleCreditCardChange = (e) => {
    setCreditCardNumber(e.target.value);
  };

  // Handler for expiry date input change
  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
  };

  // Function to validate the credit card number using Luhn algorithm
  const validateCreditCard = () => {
    const cleanedCreditCardNumber = creditCardNumber.replace(/[-\s]/g, '');
    return luhnCheck(cleanedCreditCardNumber);
  };

  // Luhn algorithm implementation for credit card validation
  const luhnCheck = (value) => {
    let sum = 0;
    let shouldDouble = false;
    for (let i = value.length - 1; i >= 0; i--) {
      let digit = parseInt(value.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) {
          digit -= 9;
        }
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  };

  // Function to validate the expiry date
  const validateExpiryDate = () => {
    const currentDate = new Date();
    const parts = expiryDate.split('/');
    const expiryMonth = parseInt(parts[0], 10);
    const expiryYear = parseInt(parts[1], 10) + 2000;
    const expiry = new Date(expiryYear, expiryMonth - 1);
    return expiry > currentDate;
  };

  // Handler for the checkout process
  const handleCheckout = async () => {
    setErrorMessage('');
    if (!validateCreditCard()) {
      setErrorMessage('Invalid credit card number.');
      return;
    }
    if (!validateExpiryDate()) {
      setErrorMessage('Credit card has expired.');
      return;
    }
    try {
      const sessionToken = localStorage.getItem('sessionToken');
      if (!sessionToken) {
        alert('You must be logged in to proceed with the checkout.');
        window.location.href = '/sign-in';
        return;
      }
      const decodedToken = decodeJWT(sessionToken);
      if (!decodedToken) {
        alert("Invalid session token.");
        return;
      }
      const userId = decodedToken.user_id;
      await checkout(userId);
      setOrderSummary(cart);
      setIsPurchaseSuccessful(true);
      await clearCart(userId);
    } catch (error) {
      console.error("Checkout failed:", error);
      setErrorMessage('Checkout failed. Please try again.');
    }
  };

  return (
    <div>
      {!isPurchaseSuccessful ? (
        <div className="mt-4">
          <div className="text-center mt-4">
            <input
              type="text"
              placeholder="Credit Card Number"
              value={creditCardNumber}
              onChange={handleCreditCardChange}
              className="input-field border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="text-center mt-2">
            <input
              type="text"
              placeholder="Expiry Date (MM/YY)"
              value={expiryDate}
              onChange={handleExpiryDateChange}
              className="input-field border border-gray-300 rounded px-3 py-2"
            />
          </div>
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          <div className="text-center mt-4">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        <SummaryPage orderSummary={orderSummary} />
      )}
    </div>
  );
}

export default Checkout;
