import React, { useState } from 'react';
import SummaryPage from './SummaryPage'; // Import the SummaryPage component


function Checkout({ cart }) {
  // State variables for credit card information, error message, and purchase status
  const [creditCardNumber, setCreditCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isPurchaseSuccessful, setIsPurchaseSuccessful] = useState(false);

  // Function to handle changes in the credit card number input field
  const handleCreditCardChange = (e) => {
    setCreditCardNumber(e.target.value);
  };

  // Function to handle changes in the expiry date input field
  const handleExpiryDateChange = (e) => {
    setExpiryDate(e.target.value);
  };

  // Function to validate the credit card number using the Luhn algorithm. Referenced from ChatGPT
  const validateCreditCard = () => {
    // Remove spaces and dashes from credit card number
    const cleanedCreditCardNumber = creditCardNumber.replace(/[-\s]/g, '');
    // Check if the credit card number is valid
    const isValid = luhnCheck(cleanedCreditCardNumber);
    return isValid;
  };

  // Referenced the luhnCheck from chatGpt. I asked how to validate a credit card.
  const luhnCheck = (value) => {
    let sum = 0;
    let shouldDouble = false;
    // Loop through each digit from right to left
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
  
  //Referenced from chatGPT. Asked how to validate the expirydate on credit card.
  // Function to validate the expiry date of the credit card
  const validateExpiryDate = () => {
    // Get current date
    const currentDate = new Date();
    // Parse expiry date string (format: MM/YY)
    const parts = expiryDate.split('/');
    const expiryMonth = parseInt(parts[0], 10);
    const expiryYear = parseInt(parts[1], 10) + 2000; // Convert 2-digit year to 4-digit year
    // Create new Date object for expiry date
    const expiry = new Date(expiryYear, expiryMonth - 1); // Subtract 1 from month 
    // Compare expiry date with current date
    return expiry > currentDate;
  };

  // Function to handle the checkout process
  const handleCheckout = () => {
    setErrorMessage('');
    // Validate credit card number
    if (!validateCreditCard()) {
      setErrorMessage('Invalid credit card number.');
      return;
    }
    // Validate expiry date
    if (!validateExpiryDate()) {
      setErrorMessage('Credit card has expired.');
      return;
    }
    // Proceed with checkout process
    alert('Checkout process initiated!');
    setIsPurchaseSuccessful(true);
  // Clear cart from localStorage
    localStorage.removeItem('cart');
  };

  
  return (
    <div>
      <div className="bg-green-500 text-white py-4">
        <h1 className="text-3xl font-semibold text-center">Checkout</h1>
      </div>
      {!isPurchaseSuccessful ? (
        <div>
          {/* Credit card input */}
          <div className="text-center mt-4">
            <input type="text" placeholder="Credit Card Number" value={creditCardNumber} onChange={handleCreditCardChange} />
          </div>
          {/* Expiry date input */}
          <div className="text-center mt-2">
            <input type="text" placeholder="Expiry Date (MM/YY)" value={expiryDate} onChange={handleExpiryDateChange} />
          </div>
          {/* Error message */}
          {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          {/* Checkout button */}
          <div className="text-center mt-4">
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      ) : (
        // Render summary page if purchase is successful
        <SummaryPage cart={cart} />
      )}
    </div>
  );
}
  

export default Checkout;
