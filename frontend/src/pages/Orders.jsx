/*Orders.jsx */
import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';

const statusColors = {
  pending: 'bg-red-100 text-red-800',
  processing: 'bg-gray-100 text-gray-800',
  shipped: 'bg-gray-100 text-gray-800',
  delivered: 'bg-green-100 text-green-800',
};

export default function Orders() {
  const [orders, setOrders] = useState(null);

  useEffect(() => {
    fetchOrders();
    console.log('Orders component mounted, fetching orders...');
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/admin/orders');
      console.log('API Response:', response.data);
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      console.log('Using mock data');
      setOrders([
        {
          id: '1',
          userId: 'user1',
          products: [{ productId: 'prod1', quantity: 2, price: 29.99 }],
          total: 59.98,
          status: 'pending',
          createdAt: '2023-11-20T10:00:00Z',
          shippingAddress: {
            street: '123 Main St',
            city: 'Springfield',
            state: 'IL',
            zipCode: '62701',
          },
        },
      ]);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch(`/api/admin/orders/${orderId}`, { status: newStatus });
      setOrders(
        orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success('Order status updated successfully', {
        style: { background: '#1a202c', color: '#fff' },
      });
    } catch (error) {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status', {
        style: { background: '#1a202c', color: '#fff' },
      });
    }
  };

  return (
    <div className="py-6 bg-black text-white">
      {orders ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-red-600">Orders</h1>
          <div className="py-6">
            <div className="overflow-hidden shadow-lg ring-1 ring-gray-800 rounded-lg">
              <table className="min-w-full divide-y divide-gray-700">
                <thead className="bg-gray-900">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-200"
                    >
                      Order ID
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Date
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Total
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-200"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700 bg-gray-800">
                  {Array.isArray(orders) ? (
                    orders.map((order) => (
                      <tr key={order.id}>
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-100">
                          #{order.id}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          {order.userId}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <span
                            className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              statusColors[order.status]
                            }`}
                          >
                            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                            className="rounded-md border-gray-700 bg-gray-900 text-gray-200 text-sm focus:border-red-600 focus:ring-red-600"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4 text-gray-400">
                        Invalid order data
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <p className="text-center text-gray-300">Loading orders...</p>
        </div>
      )}
    </div>
  );
}