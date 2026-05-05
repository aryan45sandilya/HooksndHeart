import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const { fetchCart } = useUser();
  const orderNumber = location.state?.orderNumber;

  useEffect(() => {
    // Refresh cart to show it's empty
    fetchCart();

    // If no order number, redirect to home
    if (!orderNumber) {
      navigate('/');
    }
  }, [orderNumber]);

  if (!orderNumber) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full">
        {/* Success Animation */}
        <div className="text-center mb-8 animate-scale-in">
          <div className="inline-block relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-2xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-green-400 to-green-500 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl animate-bounce-slow">
              <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-display font-bold text-rust-700 mb-4">
            Order Placed Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Thank you for your order!
          </p>
          <p className="text-gray-500">
            We've received your order and will start processing it soon.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 mb-6 animate-scale-in">
          <div className="text-center mb-6 pb-6 border-b-2 border-gray-200">
            <p className="text-gray-600 mb-2">Your Order Number</p>
            <p className="text-3xl font-bold text-rust-600 font-mono tracking-wider">
              {orderNumber}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Save this number for tracking your order
            </p>
          </div>

          {/* What's Next */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-rust-700 mb-4">What happens next?</h3>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rust-100 to-coral-100 rounded-full flex items-center justify-center">
                <span className="text-rust-600 font-bold">1</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Order Confirmation</h4>
                <p className="text-sm text-gray-600">You'll receive a confirmation message shortly</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rust-100 to-coral-100 rounded-full flex items-center justify-center">
                <span className="text-rust-600 font-bold">2</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Handcrafting Your Order</h4>
                <p className="text-sm text-gray-600">Our artisans will carefully prepare your items</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rust-100 to-coral-100 rounded-full flex items-center justify-center">
                <span className="text-rust-600 font-bold">3</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Shipping & Delivery</h4>
                <p className="text-sm text-gray-600">Your order will be shipped to your address</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-rust-100 to-coral-100 rounded-full flex items-center justify-center">
                <span className="text-rust-600 font-bold">4</span>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800">Enjoy Your Purchase!</h4>
                <p className="text-sm text-gray-600">Receive your handmade items with love ❤️</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-scale-in">
          <Link
            to="/my-orders"
            className="bg-gradient-to-r from-rust-500 to-rust-600 text-white font-bold py-4 rounded-xl hover:from-rust-600 hover:to-rust-700 transform hover:scale-105 transition-all duration-300 shadow-lg text-center flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>View My Orders</span>
          </Link>

          <Link
            to="/products"
            className="bg-white border-2 border-rust-500 text-rust-600 font-bold py-4 rounded-xl hover:bg-rust-50 transform hover:scale-105 transition-all duration-300 shadow-lg text-center flex items-center justify-center space-x-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 mb-2">Need help with your order?</p>
          <Link to="/contact" className="text-rust-600 hover:text-rust-700 font-semibold underline">
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
