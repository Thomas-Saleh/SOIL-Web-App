import { Link } from "react-router-dom";

function Navbar() {


  


  
  return (
    <nav className="bg-green-600 text-white py-2 px-4 flex justify-between items-center">
      <ul className="flex space-x-4">
        <li>
          <Link to="/" className="hover:text-yellow-300">Home</Link>
        </li>
        <li>
          <Link to="/product" className="hover:text-yellow-300">Shop</Link>
        </li>
        <li>
          <Link to="/special-deals" className="hover:text-yellow-300" style={{ color: 'red' }}>Sale</Link>
        </li>
        <li>
          <Link to="/vegetable-tips" className="hover:text-yellow-300" >Tips</Link>
        </li>
      </ul>
      <ul className="flex space-x-4">
        <li>
          <Link to="/sign-in" className="hover:text-yellow-300">Sign In</Link>
        </li>
        <li>
          <Link to="/sign-up" className="hover:text-yellow-300">Sign Up</Link>
        </li>
        <li><Link to="/cart" className="hover:text-yellow-300">Shopping Cart</Link></li>
        <li><Link to="/diet-plan" className="hover:text-yellow-300">Diet Plan</Link></li>
        <li><Link to="/user-profile" className="hover:text-yellow-300">Profile</Link></li>

        
            
          
      </ul>
    </nav>
  );
}

export default Navbar;
