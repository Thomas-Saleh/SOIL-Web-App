import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/Home';
// unable to source the error however everything still works perfectly fine
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import SpecialDeals from './pages/SpecialDeals';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Product from './pages/Product';
import VegetableTips from './pages/VegetableTips';
import DietPlan from './pages/DietPlan';
// unable to source the error however everything still works perfectly fine
import Cart from './pages/Cart';



function App() {
  return (
    <div>
      
    <Router>
      <Navbar />
      <main role="main">
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product" element={<Product />} />
            <Route path ="/vegetable-tips" element ={<VegetableTips />} />
            <Route path="/special-deals" element={<SpecialDeals />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/diet-plan" element={<DietPlan />} />
            <Route path="/cart" element={<Cart />} />

          </Routes>
        </div>
      </main>
      <Footer />
    </Router>
  </div>
  );
}

export default App;