import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-green-800 text-center text-white py-6">
      <div className="container mx-auto flex justify-between items-center">
        {/* Copyright */}
        <div className="text-green-200">&copy; {new Date().getFullYear()} SOIL Organic Food Grocer</div>

        {/* Social Media Icons */}
        <div className="flex space-x-4">
          <Link to="/" className="text-green-200" rel="noopener noreferrer">
            <img src="facebook.png" alt="Facebook" className="h-6 w-6" />
          </Link>
          <Link to="/" className="text-green-200" rel="noopener noreferrer">
            <img src="twitter.png" alt="Twitter" className="h-6 w-6" />
          </Link>
          <Link to="/" className="text-green-200" rel="noopener noreferrer">
            <img src="instagram.png" alt="Instagram" className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
