import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getImageUrl } from '../services/api';
import axios from 'axios';

function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token, isAuthenticated } = useUser();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/user-login');
      return;
    }
    fetchOrderDetails();
  }, [id, isAuthenticated]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrder(response.data.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
      alert('Failed to load order details');
      navigate('/my-orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    setCancelling(true);
    try {
      await axios.put(
        `${API_URL}/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      alert('Order cancelled successfully');
      fetchOrderDetails(); // Refresh order details
    } catch (error) {
      console.error('Error cancelling order:', error);
      alert(error.response?.data?.message || 'Failed to cancel order');
    } finally {
      setCancelling(false);
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
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  const canCancel = order.status === 'Pending' || order.status === 'Processing';

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          to="/my-orders"
          className="inline-flex items-center text-rust-600 hover:text-rust-700 font-semibold mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to My Orders
        </Link>

        {/* Order Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-scale-in">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-rust-700 mb-2">
                Order Details
              </h1>
              <p className="text-gray-600">Order Number: <span className="font-mono font-bold text-rust-600">{order.orderNumber}</span></p>
            </div>

            <div className="flex flex-col items-start md:items-end gap-2">
              <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-bold border-2 ${getStatusColor(order.status)}`}>
                <span className="mr-2">{getStatusIcon(order.status)}</span>
                {order.status}
              </span>
              <p className="text-sm text-gray-600">
                Ordered on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
          </div>

          {/* Order Tracking */}
          <div className="bg-gradient-to-r from-cream-50 to-golden-50 rounded-xl p-6">
            <h3 className="font-bold text-gray-800 mb-4">Order Tracking</h3>
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div 
                  className="h-full bg-gradient-to-r from-rust-500 to-coral-500 transition-all duration-500"
                  style={{
                    width: order.status === 'Pending' ? '0%' :
                           order.status === 'Processing' ? '33%' :
                           order.status === 'Shipped' ? '66%' :
                           order.status === 'Delivered' ? '100%' : '0%'
                  }}
                ></div>
              </div>

              {/* Status Steps */}
              {['Pending', 'Processing', 'Shipped', 'Delivered'].map((status, index) => {
                const isActive = order.status === status;
                const isPassed = ['Pending', 'Processing', 'Shipped', 'Delivered'].indexOf(order.status) >= index;
                
                return (
                  <div key={status} className="flex flex-col items-center relative z-10">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                      isPassed 
                        ? 'bg-gradient-to-br from-rust-500 to-coral-500 text-white scale-110 shadow-lg' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {isPassed ? '✓' : index + 1}
                    </div>
                    <p className={`text-xs mt-2 font-semibold ${isPassed ? 'text-rust-600' : 'text-gray-500'}`}>
                      {status}
                    </p>
                  </div>
                );
              })}
            </div>

            {order.status === 'Cancelled' && (
              <div className="mt-4 bg-red-50 border-2 border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  This order has been cancelled
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 animate-scale-in">
          <h2 className="text-2xl font-bold text-rust-700 mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={index} className="flex gap-4 p-4 bg-cream-50 rounded-xl">
                <img
                  src={item.product?.images?.[0] ? getImageUrl(item.product.images[0].url) : 'https://via.placeholder.com/100'}
                  alt={item.product?.name || 'Product'}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <h3 className="font-bold text-gray-800 mb-1">
                    {item.product?.name || 'Product'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2">
                    {item.product?.description || ''}
                  </p>
                  <p className="text-sm text-gray-700">
                    Quantity: <span className="font-semibold">{item.quantity}</span>
                  </p>
                  <p className="text-sm text-gray-700">
                    Price: <span className="font-semibold">₹{item.price}</span>
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-rust-600">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-rust-700 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              </svg>
              Shipping Address
            </h2>
            <div className="text-gray-700 space-y-1">
              <p>{order.shippingAddress.street}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
              <p>Pincode: {order.shippingAddress.pincode}</p>
              <p>Phone: {order.shippingAddress.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-scale-in">
            <h2 className="text-xl font-bold text-rust-700 mb-4 flex items-center">
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Payment Details
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Payment Method:</span>
                <span className="font-semibold">{order.paymentMethod}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Payment Status:</span>
                <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {order.paymentStatus}
                </span>
              </div>
              <div className="border-t-2 border-gray-200 pt-3">
                <div className="flex justify-between text-xl font-bold text-rust-700">
                  <span>Total Amount:</span>
                  <span>₹{order.totalAmount}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cancel Order Button */}
        {canCancel && (
          <div className="bg-white rounded-2xl shadow-lg p-6 animate-scale-in">
            <button
              onClick={handleCancelOrder}
              disabled={cancelling}
              className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
                cancelling
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-red-500 hover:bg-red-600 text-white hover:scale-105'
              }`}
            >
              {cancelling ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Cancelling...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span>Cancel Order</span>
                </>
              )}
            </button>
            <p className="text-sm text-gray-500 text-center mt-2">
              You can cancel this order while it's in Pending or Processing status
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default OrderDetails;
