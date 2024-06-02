import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './pages/Navbar';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import ProductManagement from './pages/ProductManagement';
import ReviewManagement from './pages/ReviewManagement';
import './App.css';

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/user-management" element={<UserManagement />} />
        <Route path="/product-management" element={<ProductManagement />} />
        <Route path="/review-management" element={<ReviewManagement />} />
      </Routes>
    </Router>
  );
};

export default App;
