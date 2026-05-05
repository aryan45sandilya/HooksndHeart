import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getImageUrl } from '../services/api';
import axios from 'axios';

function Checkout() {
  const navigate = useNavigate();
  const { cart, cartCount, user, token, fetchCart } = useUser();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    },
    paymentMethod: 'COD'
  });

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (!token) {
      navigate('/user-login');
      return;
    }
    fetchCart();
  }, [token]);

  useEffect(() => {
    // Pre-fill user data if available
    if (user) {
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          phone: user.phone || ''
        }
      }));
    }
  }, [user]);

  if (!cart || cartCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-golden-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block">📦</span>
          <h2 className="text-3xl font-display font-bold text-rust-700 mb-4">No Items to Checkout</h2>
          <p className="text-gray-600 mb-8">Add some items to your cart first!</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  const shippingCharge = cart.totalAmount > 1000 ? 0 : 50;
  const finalTotal = cart.totalAmount + shippingCharge;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const { street, city, state, pincode, phone } = formData.shippingAddress;
    if (!street || !city || !state || !pincode || !phone) {
      alert('Please fill all shipping address fields');
      return;
    }

    if (pincode.length !== 6) {
      alert('Please enter a valid 6-digit pincode');
      return;
    }

    if (phone.length !== 10) {
      alert('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/orders`,
        {
          items: cart.items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
            price: item.price
          })),
          shippingAddress: formData.shippingAddress,
          paymentMethod: formData.paymentMethod
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      // Navigate to success page with order number
      navigate('/order-success', { 
        state: { orderNumber: response.data.data.orderNumber }
      });
    } catch (error) {
      console.error('Order creation failed:', error);
      alert(error.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-rust-700 mb-2">Checkout</h1>
          <p className="text-gray-600">Complete your order</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-scale-in">
                <h2 className="text-2xl font-bold text-rust-700 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">Street Address *</label>
                    <input
                      type="text"
                      name="street"
                      value={formData.shippingAddress.street}
                      onChange={handleInputChange}
                      placeholder="House No., Building Name, Street"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rust-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.shippingAddress.city}
                        onChange={handleInputChange}
                        placeholder="City"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rust-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.shippingAddress.state}
                        onChange={handleInputChange}
                        placeholder="State"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rust-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={formData.shippingAddress.pincode}
                        onChange={handleInputChange}
                        placeholder="6-digit pincode"
                        maxLength="6"
                        pattern="[0-9]{6}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rust-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-semibold mb-2">Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.shippingAddress.phone}
                        onChange={handleInputChange}
                        placeholder="10-digit phone"
                        maxLength="10"
                        pattern="[0-9]{10}"
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-rust-500 focus:outline-none transition-colors"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-lg p-6 animate-scale-in">
                <h2 className="text-2xl font-bold text-rust-700 mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  {/* Cash on Delivery */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'COD' 
                      ? 'border-rust-500 bg-rust-50' 
                      : 'border-gray-200 hover:border-rust-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="COD"
                      checked={formData.paymentMethod === 'COD'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-5 h-5 text-rust-600"
                    />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold text-gray-800 flex items-center">
                        💵 Cash on Delivery (COD)
                      </p>
                      <p className="text-sm text-gray-600">Pay when you receive the product</p>
                    </div>
                    {formData.paymentMethod === 'COD' && (
                      <svg className="w-6 h-6 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>

                  {/* UPI Payment */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'UPI' 
                      ? 'border-rust-500 bg-rust-50' 
                      : 'border-gray-200 hover:border-rust-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="UPI"
                      checked={formData.paymentMethod === 'UPI'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-5 h-5 text-rust-600"
                    />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold text-gray-800 flex items-center">
                        📱 UPI Payment
                        <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Instant</span>
                      </p>
                      <p className="text-sm text-gray-600">Google Pay, PhonePe, Paytm, BHIM</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">GPay</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">PhonePe</span>
                        <span className="text-xs bg-cyan-100 text-cyan-700 px-2 py-1 rounded">Paytm</span>
                      </div>
                    </div>
                    {formData.paymentMethod === 'UPI' && (
                      <svg className="w-6 h-6 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>

                  {/* Cards */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'Card' 
                      ? 'border-rust-500 bg-rust-50' 
                      : 'border-gray-200 hover:border-rust-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Card"
                      checked={formData.paymentMethod === 'Card'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-5 h-5 text-rust-600"
                    />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold text-gray-800 flex items-center">
                        💳 Credit / Debit Card
                      </p>
                      <p className="text-sm text-gray-600">Visa, Mastercard, RuPay, Amex</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Visa</span>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Mastercard</span>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">RuPay</span>
                      </div>
                    </div>
                    {formData.paymentMethod === 'Card' && (
                      <svg className="w-6 h-6 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>

                  {/* Net Banking */}
                  <label className={`flex items-center p-4 border-2 rounded-xl cursor-pointer transition-all ${
                    formData.paymentMethod === 'NetBanking' 
                      ? 'border-rust-500 bg-rust-50' 
                      : 'border-gray-200 hover:border-rust-300'
                  }`}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="NetBanking"
                      checked={formData.paymentMethod === 'NetBanking'}
                      onChange={(e) => setFormData(prev => ({ ...prev, paymentMethod: e.target.value }))}
                      className="w-5 h-5 text-rust-600"
                    />
                    <div className="ml-4 flex-grow">
                      <p className="font-semibold text-gray-800 flex items-center">
                        🏦 Net Banking
                      </p>
                      <p className="text-sm text-gray-600">All major banks supported</p>
                    </div>
                    {formData.paymentMethod === 'NetBanking' && (
                      <svg className="w-6 h-6 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </label>

                  {/* Payment Note */}
                  {formData.paymentMethod !== 'COD' && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 mt-4">
                      <p className="text-sm text-blue-800 flex items-start">
                        <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>
                          <strong>Note:</strong> Online payment integration is currently in demo mode. 
                          Your order will be placed successfully, but actual payment processing will be added soon. 
                          For now, please use Cash on Delivery (COD) for real orders.
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center justify-center space-x-2 ${
                  loading
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-rust-500 to-rust-600 text-white hover:from-rust-600 hover:to-rust-700 hover:scale-105 shadow-lg'
                }`}
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Place Order - ₹{finalTotal}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-rust-700 mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex gap-3">
                    <img
                      src={getImageUrl(item.product.images[0]?.url)}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-grow">
                      <h4 className="font-semibold text-sm text-gray-800 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Qty: {item.quantity} × ₹{item.price}
                      </p>
                      <p className="text-sm font-bold text-rust-600">
                        ₹{item.price * item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 border-t-2 border-gray-200 pt-4">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cartCount} items)</span>
                  <span className="font-semibold">₹{cart.totalAmount}</span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {shippingCharge === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shippingCharge}`
                    )}
                  </span>
                </div>

                <div className="border-t-2 border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-rust-700">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Handmade with Love
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Fast Delivery
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
