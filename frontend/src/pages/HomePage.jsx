import { useState } from 'react';
import ProductCard from '../components/ProductCard';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { id: 2, name: 'Headphones', price: 49.99, category: 'Electronics', image: 'https://via.placeholder.com/150' },
    { id: 3, name: 'T-Shirt', price: 19.99, category: 'Clothing', image: 'https://via.placeholder.com/150' },
  ];

  const filteredProducts = products
    .filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((product) =>
      selectedCategory === 'All' ? true : product.category === selectedCategory
    );

  return (
    <div className="container mx-auto p-4 bg-black text-red-500">
      <h1 className="text-3xl font-bold mb-6 text-center">Products</h1>
      <div className="flex flex-col sm:flex-row justify-between mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full sm:w-1/2 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-black text-red-500"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-1/4 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500 bg-black text-red-500"
        >
          <option value="All">All Categories</option>
          <option value="Electronics">Electronics</option>
          <option value="Clothing">Clothing</option>
        </select>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <p className="text-center text-gray-600 col-span-full">No products found.</p>
        ) : (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        )}
      </div>
    </div>
  );
}

export default HomePage;