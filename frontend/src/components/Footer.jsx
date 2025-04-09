import { Link } from 'react-router-dom';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaFacebook, FaTwitter, FaInstagram, FaGithub } from 'react-icons/fa';

function Footer() {
  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing! (This is a placeholder action.)');
  };

  return (
    <footer className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-10 mt-auto">
      <div className="container mx-auto px-4">
        {/* Horizontal Layout for Footer Sections */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Contact Info */}
          <div>
            <h3 className="text-2xl font-semibold mb-5 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-center space-x-3">
                <FaPhone className="text-yellow-300 text-xl" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <FaEnvelope className="text-yellow-300 text-xl" />
                <a href="mailto:support@ecommerce.com" className="hover:text-yellow-300 transition-colors duration-300">
                  support@ecommerce.com
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <FaMapMarkerAlt className="text-yellow-300 text-xl" />
                <span>123 E-Commerce St, Shop City, USA</span>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">Quick Links</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="hover:text-yellow-300 transition-colors duration-300 text-lg">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-yellow-300 transition-colors duration-300 text-lg">
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-yellow-300 transition-colors duration-300 text-lg">
                  Wishlist
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">Follow Us</h3>
            <div className="flex space-x-6">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300">
                <FaFacebook className="text-3xl" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300">
                <FaTwitter className="text-3xl" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300">
                <FaInstagram className="text-3xl" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-yellow-300 hover:text-yellow-400 transition-colors duration-300">
                <FaGithub className="text-3xl" />
              </a>
            </div>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="text-2xl font-semibold mb-5">Newsletter</h3>
            <p className="text-lg mb-4">Stay updated with our latest offers!</p>
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                className="p-3 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                required
              />
              <button
                type="submit"
                className="bg-yellow-300 text-blue-800 px-4 py-2 rounded-lg hover:bg-yellow-400 transition-colors duration-300 font-semibold"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-10 text-center border-t border-blue-500 pt-5">
          <p className="text-lg">© {new Date().getFullYear()} E-Commerce. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;