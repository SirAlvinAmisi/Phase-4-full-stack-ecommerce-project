
import { useState, useEffect } from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import toast from 'react-hot-toast';
import axios from 'axios';

export default function Products() {
  const [products, setProducts] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    fetchProducts();
    console.log('Products component mounted, fetching products...');
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('/api/admin/products');
      console.log('API Response:', response.data);
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch products:', error);
      console.log('Using mock data');
      setProducts([
        {
          id: '1',
          name: 'Basic Tee',
          description: 'A comfortable cotton t-shirt',
          price: 29.99,
          stock: 50,
          image:
            'https://tailwindui.com/img/ecommerce-images/product-page-01-related-product-01.jpg',
          category: 'Clothing',
        },
      ]);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/admin/products', newProduct);
      setIsAddModalOpen(false);
      fetchProducts();
      toast.success('Product added successfully', {
        style: { background: '#1a202c', color: '#fff' },
      });
    } catch (error) {
      console.error('Failed to add product:', error);
      toast.error('Failed to add product', {
        style: { background: '#1a202c', color: '#fff' },
      });
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`/api/admin/products/${productId}`);
      setProducts(products.filter((p) => p.id !== productId));
      toast.success('Product deleted successfully', {
        style: { background: '#1a202c', color: '#fff' },
      });
    } catch (error) {
      console.error('Failed to delete product:', error);
      toast.error('Failed to delete product', {
        style: { background: '#1a202c', color: '#fff' },
      });
    }
  };

  return (
    <div className="py-6 bg-black text-white">
      {products ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold text-red-600">Products</h1>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700"
            >
              Add Product
            </button>
          </div>
          <div className="py-6">
            <div className="overflow-hidden shadow-lg ring-1 ring-gray-800 rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-200"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                    >
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {Array.isArray(products) ? (
                    products.map((product) => (
                      <tr key={product.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="flex items-center">
                            <div className="h-12 w-12 flex-shrink-0">
                              <img
                                className="h-12 w-12 rounded-lg"
                                src={product.image}
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="font-medium text-gray-100">{product.name}</div>
                              <div className="text-gray-400">{product.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                          {product.category}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                          ${product.price.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-400">
                          {product.stock}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <button
                            className="text-red-400 hover:text-red-600 mr-4"
                            onClick={() => {/* Handle edit */}}
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-400"
                            onClick={() => handleDelete(product.id)}
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-4 text-gray-400">
                        Invalid product data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Modal */}
          <Dialog
            open={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            className="relative z-50"
          >
            <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-gray-800 p-6 shadow-lg">
                <Dialog.Title className="text-lg font-medium leading-6 text-red-600 mb-4">
                  Add New Product
                </Dialog.Title>
                <form onSubmit={handleAddProduct}>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Name</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                        value={newProduct.name}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, name: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">
                        Description
                      </label>
                      <textarea
                        required
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                        value={newProduct.description}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, description: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Price</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                        value={newProduct.price}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, price: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Stock</label>
                      <input
                        type="number"
                        required
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                        value={newProduct.stock}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, stock: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Category</label>
                      <input
                        type="text"
                        required
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                        value={newProduct.category}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, category: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300">Image URL</label>
                      <input
                        type="url"
                        required
                        className="mt-1 block w-full rounded-md border-gray-700 bg-gray-900 text-white shadow-sm focus:border-red-600 focus:ring-red-600 sm:text-sm"
                        value={newProduct.image}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, image: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div className="mt-6 flex justify-end space-x-3">
                    <button
                      type="button"
                      className="rounded-md border border-gray-600 bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    >
                      Add Product
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <p className="text-center text-gray-300">Loading products...</p>
        </div>
      )}
    </div>
  );
}