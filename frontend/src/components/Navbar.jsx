import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  FaHome, FaShoppingCart, FaHeart, FaSignOutAlt, FaSignInAlt
} from 'react-icons/fa';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-900 text-white py-6 sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center text-xl">
        
        {/* Left Side: Logo */}
        <div className="flex items-center space-x-12">
          <Link to="/" className="text-3xl font-bold flex items-center">
            <span className="text-yellow-400 mr-3">🛒</span>
            Ecommerce
          </Link>
        </div>

        {/* Right Side: Links */}
        <div className="flex items-center space-x-20">
          {/* Home Link */}
          <Link to="/" className="flex items-center space-x-3 hover:text-yellow-400">
            <FaHome className="text-2xl" />
            <span className="text-white">Home</span>
          </Link>

          {/* Cart Link */}
          <Link to="/cart" className="flex items-center space-x-3 hover:text-yellow-400 relative">
            <FaShoppingCart className="text-2xl" />
            {cart.length > 0 && (
              <span
                className="absolute -top-4 -right-4 bg-blue-500 text-white text-sm rounded-full h-7 w-7 flex items-center justify-center z-50"
              >
                {cart.length}
              </span>
            )}
            <span className="text-white">Cart</span>
          </Link>

          {/* Wishlist Link */}
          <Link to="/wishlist" className="flex items-center space-x-3 hover:text-yellow-400">
            <FaHeart className="text-2xl" />
            <span className="text-white">Wishlist</span>
          </Link>

          {/* Login/Logout */}
          {user ? (
            <div className="flex items-center space-x-3 hover:text-yellow-400 cursor-pointer" onClick={logout}>
              <FaSignOutAlt className="text-2xl" />
              <span className="text-white">Logout</span>
            </div>
          ) : (
            <Link to="/login" className="flex items-center space-x-3 hover:text-yellow-400">
              <FaSignInAlt className="text-2xl" />
              <span className="text-white">Login</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;