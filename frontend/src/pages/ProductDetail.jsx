import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Mock data - in a real app this would come from an API
  const products = [
    { id: 1, name: 'Laptop', price: 999.99, image: 'https://via.placeholder.com/150', category: 'Electronics', description: 'A high-performance laptop for work and gaming.' },
    { id: 2, name: 'Headphones', price: 49.99, image: 'https://via.placeholder.com/150', category: 'Electronics', description: 'Wireless headphones with noise cancellation.' },
    { id: 3, name: 'T-Shirt', price: 19.99, image: 'https://via.placeholder.com/150', category: 'Clothing', description: 'Comfortable cotton t-shirt in various sizes.' },
    { id: 4, name: 'Jeans', price: 39.99, image: 'https://via.placeholder.com/150', category: 'Clothing', description: 'Stylish denim jeans for everyday wear.' },
  ];

  const product = products.find((p) => p.id === parseInt(id));

  if (!product) {
    return <div className="container mx-auto p-4 text-center">Product not found</div>;
  }

  const handleAddToCart = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image
    });
  };

  const handleWishlistAction = () => {
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
        image: product.image
      });
    }
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const inCart = cart.some(item => item.id === product.id);

  return (
    <div className="container mx-auto p-4 bg-black text-red-500">
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-red-500 hover:underline"
      >
        ← Back to Products
      </button>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="w-full md:w-1/2">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-auto rounded-lg shadow-md"
            onError={(e) => (e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found')}
          />
        </div>
        
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <p className="text-2xl text-red-400 mb-4">${product.price.toFixed(2)}</p>
          <p className="text-red-400 mb-2">
            <span className="font-semibold">Category:</span> {product.category}
          </p>
          <p className="mb-6 text-red-300">{product.description}</p>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleAddToCart}
              disabled={inCart}
              className={`px-6 py-3 rounded-md ${inCart 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-red-500 hover:bg-red-600'} text-white transition-colors`}
            >
              {inCart ? 'Added to Cart' : 'Add to Cart'}
            </button>
            
            <button
              onClick={handleWishlistAction}
              className={`px-6 py-3 rounded-md border ${isInWishlist(product.id)
                ? 'border-red-500 text-red-500 hover:bg-red-50'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'} transition-colors`}
            >
              {isInWishlist(product.id) ? '❤️ Remove from Wishlist' : '🤍 Add to Wishlist'}
            </button>
            
            {inCart && (
              <button
                onClick={goToCart}
                className="px-6 py-3 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                View Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;