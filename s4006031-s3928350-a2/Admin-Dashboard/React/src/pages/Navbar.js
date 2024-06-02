import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Dashboard</Link></li>
        <li><Link to="/user-management">User Management</Link></li>
        <li><Link to="/product-management">Product Management</Link></li>
        <li><Link to="/review-management">Review Management</Link></li>
      </ul>
    </nav>
  );
};

export default Navbar;
