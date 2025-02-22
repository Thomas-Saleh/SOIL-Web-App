import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

function Navbar() {
  const [productDropdown, setProductDropdown] = useState(false);
  const [accountDropdown, setAccountDropdown] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState(null);
  const productRef = useRef(null);
  const accountRef = useRef(null);

  const showDropdown = (setDropdown) => {
    clearTimeout(hoverTimeout);
    setDropdown(true);
  };

  const hideDropdown = (setDropdown) => {
    const timeoutId = setTimeout(() => {
      setDropdown(false);
    }, 100); // 100ms delay before hiding the dropdown
    setHoverTimeout(timeoutId);
  };

  const clearShoppingCart = () => {
    localStorage.removeItem('cart');
  };

  const handleLogout = () => {
    clearShoppingCart();
    localStorage.removeItem('sessionToken');
    window.location.href = '/'; // Redirect to homepage
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        productRef.current &&
        !productRef.current.contains(event.target) &&
        accountRef.current &&
        !accountRef.current.contains(event.target)
      ) {
        setProductDropdown(false);
        setAccountDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-md">
      <div className="max-w-screen-xl mx-auto p-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img src="SOIL icon.png" className="h-10" alt="SOIL Icon" />
          <span className="self-center text-2xl font-semibold">SOIL</span>
        </Link>
        <div className="flex space-x-4 items-center">
          <ul className="flex space-x-4 items-center">
            <li
              className="relative"
              ref={productRef}
              onMouseEnter={() => showDropdown(setProductDropdown)}
              onMouseLeave={() => hideDropdown(setProductDropdown)}
            >
              <button
                className="flex items-center justify-between text-gray-900 hover:text-blue-700 py-2 px-3 rounded focus:outline-none"
              >
                Products
                <svg className="w-2.5 h-2.5 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {productDropdown && (
                <div
                  className="absolute z-10 bg-white border border-gray-200 shadow-lg mt-2 rounded-lg w-44"
                  onMouseEnter={() => setProductDropdown(true)}
                  onMouseLeave={(e) => {
                    if (!productRef.current.contains(e.relatedTarget)) {
                      setProductDropdown(false);
                    }
                  }}
                >
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link to="/product" className="block px-4 py-2 hover:bg-gray-100">Shop</Link>
                    </li>
                    <li>
                      <Link to="/special-deals" className="block px-4 py-2 hover:bg-gray-100">Sale</Link>
                    </li>
                  </ul>
                </div>
              )}
            </li>
          </ul>
          <ul className="flex space-x-4 items-center">
            <li
              className="relative"
              ref={accountRef}
              onMouseEnter={() => showDropdown(setAccountDropdown)}
              onMouseLeave={() => hideDropdown(setAccountDropdown)}
            >
              <button
                className="flex items-center justify-between text-gray-900 hover:text-blue-700 py-2 px-3 rounded focus:outline-none"
              >
                <img src="user.png" className="h-6" alt="Account Icon" />
              </button>
              {accountDropdown && (
                <div
                  className="absolute z-10 bg-white border border-gray-200 shadow-lg mt-2 rounded-lg w-44"
                  onMouseEnter={() => setAccountDropdown(true)}
                  onMouseLeave={(e) => {
                    if (!accountRef.current.contains(e.relatedTarget)) {
                      setAccountDropdown(false);
                    }
                  }}
                >
                  <ul className="py-2 text-sm text-gray-700">
                    <li>
                      <Link to="/sign-in" className="block px-4 py-2 hover:bg-gray-100">Sign In</Link>
                    </li>
                    <li>
                      <Link to="/sign-up" className="block px-4 py-2 hover:bg-gray-100">Sign Up</Link>
                    </li>
                    <li>
                      <Link to="/user-profile" className="block px-4 py-2 hover:bg-gray-100">Profile</Link>
                    </li>
                    <li>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 hover:bg-gray-100">Logout</button>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <Link to="/cart" className="text-gray-900 hover:text-blue-700 py-2 px-3 rounded">
                <img src="trolley-cart.png" className="h-6" alt="Shopping Cart Icon" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
