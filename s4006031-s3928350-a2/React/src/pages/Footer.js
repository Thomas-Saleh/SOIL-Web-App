import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-green-600 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex space-x-4">
          <Link to="/" rel="noopener noreferrer">
            <img src="facebook.png" alt="Facebook" className="h-6 w-6" />
          </Link>
          <Link to="/" rel="noopener noreferrer">
            <img src="twitter.png" alt="Twitter" className="h-6 w-6" />
          </Link>
          <Link to="/" rel="noopener noreferrer">
            <img src="instagram.png" alt="Instagram" className="h-6 w-6" />
          </Link>
        </div>
        <div className="text-gray-100 text-sm">&copy; SOIL Organic Food Grocer {new Date().getFullYear()}</div>
      </div>
    </footer>
  );
}

export default Footer;
