import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import axios from 'axios';

function MyOrders() {
  const navigate = useNavigate();
  const { token, isAuthenticated } = useUser();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user-login');
      return;
    }
    fetchOrders();
  }, [isAuthenticated]);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      Processing: 'bg-blue-100 text-blue-800 border-blue-300',
      Shipped: 'bg-purple-100 text-purple-800 border-purple-300',
      Delivered: 'bg-green-100 text-green-800 border-green-300',
      Cancelled: 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      Pending: '⏳',
      Processing: '⚙️',
      Shipped: '🚚',
      Delivered: '✅',
      Cancelled: '❌'
    };
    return icons[status] || '📦';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-golden-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rust-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-golden-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block animate-bounce-slow">📦</span>
          <h2 className="text-3xl font-display font-bold text-rust-700 mb-4">No Orders Yet</h2>
          <p className="text-gray-600 mb-8">Start shopping to see your orders here!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-rust-700 mb-2">My Orders</h1>
          <p className="text-gray-600">{orders.length} {orders.length === 1 ? 'order' : 'orders'} found</p>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-scale-in hover:shadow-2xl transition-shadow">
              {/* Order Header */}
              <div className="bg-gradient-to-r from-cream-100 to-golden-100 p-6 border-b-2 border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Order Number</p>
                    <p className="text-xl font-bold text-rust-700 font-mono">
                      {order.orderNumber}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Order Date</p>
                      <p className="font-semibold text-gray-800">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                      <p className="text-xl font-bold text-rust-600">
                        ₹{order.totalAmount}
                      </p>
                    </div>

                    <div>
                      <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                        <span className="mr-2">{getStatusIcon(order.status)}</span>
                        {order.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Items */}
              <div className="p-6">
                <div className="space-y-4 mb-4">
                  {order.items.slice(0, 2).map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-cream-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🧶</span>
                      </div>
                      <div className="flex-grow">
                        <p className="font-semibold text-gray-800">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-sm text-gray-600">
                          Qty: {item.quantity} × ₹{item.price}
                        </p>
                      </div>
                      <p className="font-bold text-rust-600">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-gray-600 italic">
                      +{order.items.length - 2} more {order.items.length - 2 === 1 ? 'item' : 'items'}
                    </p>
                  )}
                </div>

                {/* Shipping Address */}
                <div className="bg-cream-50 rounded-xl p-4 mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Shipping Address
                  </p>
                  <p className="text-sm text-gray-600">
                    {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}
                  </p>
                  <p className="text-sm text-gray-600">
                    Phone: {order.shippingAddress.phone}
                  </p>
                </div>

                {/* Action Button */}
                <Link
                  to={`/order/${order._id}`}
                  className="block w-full bg-gradient-to-r from-rust-500 to-rust-600 text-white text-center font-semibold py-3 rounded-xl hover:from-rust-600 hover:to-rust-700 transition-all duration-300 hover:scale-105"
                >
                  View Order Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyOrders;
