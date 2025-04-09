import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
  };

  const handleWishlistAction = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      });
    }
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="block bg-black rounded-lg shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
    >
      <div className="relative">
        {/* Product Image */}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover mb-4"
          onError={(e) => {
            if (!e.target.src.includes('placeholder')) {
              e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
            }
          }}
        />
      </div>

      {/* Product Details */}
      <div className="p-4">
        <h2 className="text-xl font-semibold text-red-500 mb-2">{product.name}</h2>
        <p className="text-red-400 text-lg mb-4">${product.price.toFixed(2)}</p>
        <div className="flex space-x-3">
          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="bg-red-500 text-white px-4 py-1 rounded-lg hover:bg-red-600 transition-colors duration-200"
          >
            Add to Cart
          </button>

          {/* Add to Wishlist Button */}
          <button
            onClick={handleWishlistAction}
            className={`px-4 py-1 rounded-lg border ${isInWishlist(product.id)
              ? 'border-red-500 text-red-500 hover:bg-red-50'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors duration-200`}
          >
            {isInWishlist(product.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
          </button>
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;