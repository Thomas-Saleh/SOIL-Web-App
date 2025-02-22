import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Home from './pages/Home';
import Navbar from './pages/Navbar';
import Footer from './pages/Footer';
import SpecialDeals from './pages/SpecialDeals';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import SummaryPage from './pages/SummaryPage';



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
            <Route path="/special-deals" element={<SpecialDeals />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/user-profile" element={<Profile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" component={<Checkout />} />
            <Route path="/summary" component={<SummaryPage />} />

          </Routes>
        </div>
      </main>
      <Footer />
    </Router>
  </div>
  );
}

export default App;