import { useState, useEffect } from 'react';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CubeIcon,
  ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/stats');
        console.log('API Response:', response.data);
        setStats({
          totalOrders: Number(response.data.totalOrders) || 0,
          totalRevenue: Number(response.data.totalRevenue) || 0,
          totalProducts: Number(response.data.totalProducts) || 0,
          lowStockProducts: Number(response.data.lowStockProducts) || 0,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        console.log('Using mock data');
        setStats({
          totalOrders: 150,
          totalRevenue: 15000,
          totalProducts: 75,
          lowStockProducts: 5,
        });
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="py-6 bg-black text-white">
      {stats ? (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <h1 className="text-3xl font-bold text-red-600">Dashboard</h1>
          <div className="py-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {/* Total Orders */}
              <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ShoppingBagIcon className="h-8 w-8 text-red-400" />
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-300">Total Orders</dt>
                        <dd className="text-2xl font-semibold text-white">
                          {stats.totalOrders}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue */}
              <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CurrencyDollarIcon className="h-8 w-8 text-red-400" />
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-300">Total Revenue</dt>
                        <dd className="text-2xl font-semibold text-white">
                          ${stats.totalRevenue.toLocaleString() || '0'}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <CubeIcon className="h-8 w-8 text-red-400" />
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-300">Total Products</dt>
                        <dd className="text-2xl font-semibold text-white">
                          {stats.totalProducts}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Low Stock */}
              <div className="overflow-hidden rounded-lg bg-gray-800 shadow-lg">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <ExclamationCircleIcon className="h-8 w-8 text-red-600" />
                    </div>
                    <div className="ml-6 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-300">Low Stock Items</dt>
                        <dd className="text-2xl font-semibold text-white">
                          {stats.lowStockProducts}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
          <p className="text-center text-gray-300">Loading...</p>
        </div>
      )}
    </div>
  );
}