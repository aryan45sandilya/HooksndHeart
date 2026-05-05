import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getImageUrl } from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const { cart, cartCount, updateCartItem, removeFromCart, fetchCart, isAuthenticated } = useUser();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-golden-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block animate-bounce-slow">🛒</span>
          <h2 className="text-3xl font-display font-bold text-rust-700 mb-4">Login Required</h2>
          <p className="text-gray-600 mb-8">Please login to view your cart</p>
          <Link to="/user-login" className="btn-primary">
            Login Now
          </Link>
        </div>
      </div>
    );
  }

  if (!cart || cartCount === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cream-50 to-golden-50 flex items-center justify-center px-4">
        <div className="text-center">
          <span className="text-8xl mb-6 block animate-bounce-slow">🛒</span>
          <h2 className="text-3xl font-display font-bold text-rust-700 mb-4">Your Cart is Empty</h2>
          <p className="text-gray-600 mb-8">Add some beautiful handmade items to your cart!</p>
          <Link to="/products" className="btn-primary">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    await updateCartItem(productId, newQuantity);
  };

  const handleRemove = async (productId) => {
    if (confirm('Remove this item from cart?')) {
      await removeFromCart(productId);
    }
  };

  const shippingCharge = cart.totalAmount > 1000 ? 0 : 50;
  const finalTotal = cart.totalAmount + shippingCharge;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-rust-700 mb-2">Shopping Cart</h1>
          <p className="text-gray-600">{cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item._id} className="bg-white rounded-2xl shadow-lg p-6 animate-scale-in">
                <div className="flex gap-6">
                  {/* Product Image */}
                  <Link to={`/products/${item.product._id}`} className="flex-shrink-0">
                    <img
                      src={getImageUrl(item.product.images[0]?.url)}
                      alt={item.product.name}
                      className="w-32 h-32 object-cover rounded-xl hover:scale-105 transition-transform"
                    />
                  </Link>

                  {/* Product Details */}
                  <div className="flex-grow">
                    <Link to={`/products/${item.product._id}`}>
                      <h3 className="text-xl font-bold text-rust-700 hover:text-rust-600 mb-2">
                        {item.product.name}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {item.product.description}
                    </p>

                    <div className="flex items-center justify-between">
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                          className="w-10 h-10 rounded-full bg-cream-100 hover:bg-rust-100 text-rust-600 font-bold transition-colors"
                        >
                          -
                        </button>
                        <span className="text-lg font-semibold w-12 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                          className="w-10 h-10 rounded-full bg-cream-100 hover:bg-rust-100 text-rust-600 font-bold transition-colors"
                        >
                          +
                        </button>
                      </div>

                      {/* Price */}
                      <div className="text-right">
                        <p className="text-2xl font-bold text-rust-600">
                          ₹{item.price * item.quantity}
                        </p>
                        <p className="text-sm text-gray-500">₹{item.price} each</p>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemove(item.product._id)}
                    className="flex-shrink-0 text-red-500 hover:text-red-700 transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-rust-700 mb-6">Order Summary</h2>

              <div className="space-y-4 mb-6">
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

                {cart.totalAmount < 1000 && (
                  <p className="text-sm text-green-600 bg-green-50 p-3 rounded-lg">
                    Add ₹{1000 - cart.totalAmount} more for FREE shipping!
                  </p>
                )}

                <div className="border-t-2 border-gray-200 pt-4">
                  <div className="flex justify-between text-xl font-bold text-rust-700">
                    <span>Total</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-gradient-to-r from-rust-500 to-rust-600 text-white font-bold py-4 rounded-xl hover:from-rust-600 hover:to-rust-700 transform hover:scale-105 transition-all duration-300 shadow-lg mb-4"
              >
                Proceed to Checkout
              </button>

              <Link
                to="/products"
                className="block text-center text-rust-600 hover:text-rust-700 font-semibold"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
