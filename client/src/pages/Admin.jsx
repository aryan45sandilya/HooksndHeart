import { useState, useEffect } from 'react';
import { productAPI, getImageUrl, settingsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function Admin() {
  const { token, admin } = useAuth();
  const [activeTab, setActiveTab] = useState('products'); // 'products', 'orders', 'settings'
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'other',
    inStock: true,
    featured: false,
    tags: ''
  });
  const [images, setImages] = useState([]);

  // Settings state
  const [settingsStep, setSettingsStep] = useState('select'); // 'select' | 'otp' | 'update'
  const [settingsType, setSettingsType] = useState(''); // 'username' | 'email' | 'password'
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [settingsMsg, setSettingsMsg] = useState({ type: '', text: '' });
  const [showNewPass, setShowNewPass] = useState(false);
  const [showCurrPass, setShowCurrPass] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || '/api';

  useEffect(() => {
    if (activeTab === 'products') {
      fetchProducts();
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productAPI.getAll();
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/orders/admin/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.put(
        `${API_URL}/orders/admin/${orderId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Order status updated successfully!');
      fetchOrders();
    } catch (error) {
      alert('Error updating order status: ' + (error.response?.data?.message || error.message));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Processing: 'bg-blue-100 text-blue-800',
      Shipped: 'bg-purple-100 text-purple-800',
      Delivered: 'bg-green-100 text-green-800',
      Cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('description', formData.description);
      data.append('price', formData.price);
      data.append('category', formData.category);
      data.append('inStock', formData.inStock);
      data.append('featured', formData.featured);
      data.append('tags', formData.tags);

      images.forEach(image => {
        data.append('images', image);
      });

      await productAPI.create(data);
      
      alert('Product created successfully!');
      setShowForm(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'other',
        inStock: true,
        featured: false,
        tags: ''
      });
      setImages([]);
      fetchProducts();
    } catch (error) {
      alert('Error creating product: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.delete(id);
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      alert('Error deleting product: ' + (error.response?.data?.message || error.message));
    }
  };

  // Settings handlers
  const resetSettings = () => {
    setSettingsStep('select');
    setSettingsType('');
    setOtpSent(false);
    setOtpValue('');
    setNewValue('');
    setCurrentPassword('');
    setSettingsMsg({ type: '', text: '' });
  };

  const handleRequestOTP = async (type) => {
    setSettingsType(type);
    setSettingsLoading(true);
    setSettingsMsg({ type: '', text: '' });
    try {
      const res = await settingsAPI.requestOTP(type);
      setOtpSent(true);
      setSettingsStep('otp');
      setSettingsMsg({
        type: 'success',
        text: res.data.devMode
          ? '✅ OTP generated! Check server console (SMS API not configured yet)'
          : `✅ OTP sent to your registered phone numbers`
      });
    } catch (err) {
      setSettingsMsg({ type: 'error', text: err.response?.data?.message || 'Failed to send OTP' });
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleVerifyAndUpdate = async () => {
    if (!otpValue || otpValue.length !== 6) {
      setSettingsMsg({ type: 'error', text: 'Please enter the 6-digit OTP' });
      return;
    }
    if (!newValue.trim()) {
      setSettingsMsg({ type: 'error', text: `Please enter the new ${settingsType}` });
      return;
    }
    if (settingsType === 'password' && !currentPassword) {
      setSettingsMsg({ type: 'error', text: 'Please enter your current password' });
      return;
    }

    setSettingsLoading(true);
    setSettingsMsg({ type: '', text: '' });
    try {
      const res = await settingsAPI.verifyAndUpdate({
        changeType: settingsType,
        otp: otpValue,
        newValue: newValue.trim(),
        currentPassword: currentPassword || undefined
      });
      setSettingsMsg({ type: 'success', text: `🎉 ${res.data.message}` });
      setTimeout(() => resetSettings(), 2500);
    } catch (err) {
      setSettingsMsg({ type: 'error', text: err.response?.data?.message || 'Update failed' });
    } finally {
      setSettingsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-display font-bold text-rust-700 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage your products and orders</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-lg mb-6 overflow-hidden">
          <div className="flex border-b-2 border-gray-200">
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-1 py-4 px-3 sm:px-6 font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'products'
                  ? 'bg-gradient-to-r from-rust-500 to-rust-600 text-white'
                  : 'text-gray-600 hover:bg-cream-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <span className="hidden sm:inline">Products</span>
                <span className="sm:hidden">Items</span>
                <span className="ml-1">({products.length})</span>
              </span>
            </button>
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 px-3 sm:px-6 font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'orders'
                  ? 'bg-gradient-to-r from-rust-500 to-rust-600 text-white'
                  : 'text-gray-600 hover:bg-cream-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Orders
                <span className="ml-1">({orders.length})</span>
              </span>
            </button>
            <button
              onClick={() => { setActiveTab('settings'); resetSettings(); }}
              className={`flex-1 py-4 px-3 sm:px-6 font-semibold transition-all duration-300 text-sm sm:text-base ${
                activeTab === 'settings'
                  ? 'bg-gradient-to-r from-rust-500 to-rust-600 text-white'
                  : 'text-gray-600 hover:bg-cream-100'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </span>
            </button>
          </div>
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <>
            <div className="flex justify-end mb-6">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-gradient-to-r from-rust-500 to-rust-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rust-600 hover:to-rust-700 transition-all duration-300 hover:scale-105 shadow-lg"
              >
                {showForm ? 'Cancel' : '+ Add Product'}
              </button>
            </div>

      {/* Add Product Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-2xl shadow-lg mb-8 animate-scale-in">
          <h2 className="text-2xl font-bold text-rust-700 mb-6">Add New Product</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Product Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Price (₹) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  className="input-field"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="bags">Bags</option>
                  <option value="toys">Toys</option>
                  <option value="home-decor">Home Decor</option>
                  <option value="accessories">Accessories</option>
                  <option value="clothing">Clothing</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Tags (comma separated)</label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="handmade, colorful, gift"
                  className="input-field"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="input-field"
              ></textarea>
            </div>

            <div className="mt-4">
              <label className="block text-gray-700 font-medium mb-2">Images (max 5) *</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                required
                className="input-field"
              />
              {images.length > 0 && (
                <p className="text-sm text-gray-600 mt-2">{images.length} file(s) selected</p>
              )}
            </div>

            <div className="mt-4 flex gap-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="inStock"
                  checked={formData.inStock}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">In Stock</span>
              </label>

              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="featured"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="mr-2"
                />
                <span className="text-gray-700">Featured Product</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-rust-500 to-rust-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-rust-600 hover:to-rust-700 transition-all duration-300 hover:scale-105 shadow-lg mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <h2 className="text-2xl font-bold text-rust-700 p-6 border-b-2 border-gray-200">All Products</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map(product => (
                <tr key={product._id}>
                  <td className="px-6 py-4">
                    <img
                      src={getImageUrl(product.images[0]?.url)}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                  </td>
                  <td className="px-6 py-4 font-medium">{product.name}</td>
                  <td className="px-6 py-4">₹{product.price}</td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )}

  {/* Orders Tab */}
  {activeTab === 'orders' && (
    <div className="space-y-6">
      {loading ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-rust-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600">Loading orders...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <span className="text-6xl mb-4 block">📦</span>
          <h3 className="text-2xl font-bold text-rust-700 mb-2">No Orders Yet</h3>
          <p className="text-gray-600">Orders will appear here when customers place them</p>
        </div>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden animate-scale-in">
            {/* Order Header */}
            <div className="bg-gradient-to-r from-cream-100 to-golden-100 p-6 border-b-2 border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Order Number</p>
                  <p className="text-xl font-bold text-rust-700 font-mono">{order.orderNumber}</p>
                  <p className="text-sm text-gray-600 mt-2">
                    Customer: <span className="font-semibold">{order.user?.name || 'N/A'}</span>
                  </p>
                  <p className="text-sm text-gray-600">
                    Email: <span className="font-semibold">{order.user?.email || 'N/A'}</span>
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
                    <p className="text-xl font-bold text-rust-600">₹{order.totalAmount}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Status</p>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                      className={`px-4 py-2 rounded-full text-sm font-bold border-2 cursor-pointer ${getStatusColor(order.status)}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Details */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Order Items */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    Order Items ({order.items.length})
                  </h3>
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex items-center gap-3 bg-cream-50 p-3 rounded-lg">
                        <div className="w-12 h-12 bg-cream-200 rounded-lg flex items-center justify-center">
                          <span className="text-xl">🧶</span>
                        </div>
                        <div className="flex-grow">
                          <p className="font-semibold text-sm text-gray-800">
                            {item.product?.name || 'Product'}
                          </p>
                          <p className="text-xs text-gray-600">
                            Qty: {item.quantity} × ₹{item.price}
                          </p>
                        </div>
                        <p className="font-bold text-rust-600">₹{item.price * item.quantity}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping & Payment */}
                <div>
                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    Shipping Address
                  </h3>
                  <div className="bg-cream-50 p-4 rounded-lg mb-4">
                    <p className="text-sm text-gray-700">{order.shippingAddress.street}</p>
                    <p className="text-sm text-gray-700">
                      {order.shippingAddress.city}, {order.shippingAddress.state}
                    </p>
                    <p className="text-sm text-gray-700">Pincode: {order.shippingAddress.pincode}</p>
                    <p className="text-sm text-gray-700">Phone: {order.shippingAddress.phone}</p>
                  </div>

                  <h3 className="font-bold text-gray-800 mb-4 flex items-center">
                    <svg className="w-5 h-5 mr-2 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Payment Info
                  </h3>
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Method:</span>
                      <span className="font-semibold">{order.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className={`font-semibold ${order.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )}
      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-lg mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-rust-500 to-rust-600 p-6 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-xl font-bold">Account Settings</h2>
                  <p className="text-cream-200 text-sm">Change credentials with OTP verification</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Alert Message */}
              {settingsMsg.text && (
                <div className={`mb-5 px-4 py-3 rounded-xl text-sm font-medium flex items-start gap-2 ${
                  settingsMsg.type === 'success'
                    ? 'bg-green-50 border border-green-300 text-green-700'
                    : 'bg-red-50 border border-red-300 text-red-700'
                }`}>
                  <span className="text-lg leading-none mt-0.5">
                    {settingsMsg.type === 'success' ? '✅' : '❌'}
                  </span>
                  <span>{settingsMsg.text}</span>
                </div>
              )}

              {/* STEP 1: Select what to change */}
              {settingsStep === 'select' && (
                <div className="space-y-3">
                  <p className="text-gray-600 text-sm mb-4">
                    Select what you want to change. An OTP will be sent to your registered phone numbers for verification.
                  </p>

                  {[
                    { type: 'username', icon: '👤', label: 'Change Username', desc: 'Update your admin login username' },
                    { type: 'email', icon: '📧', label: 'Change Email', desc: 'Update your admin email address' },
                    { type: 'password', icon: '🔒', label: 'Change Password', desc: 'Update your admin password' },
                  ].map((item) => (
                    <button
                      key={item.type}
                      onClick={() => handleRequestOTP(item.type)}
                      disabled={settingsLoading}
                      className="w-full flex items-center gap-4 p-4 rounded-xl border-2 border-cream-200 hover:border-rust-400 hover:bg-cream-50 transition-all duration-200 text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="w-12 h-12 bg-gradient-to-br from-rust-100 to-coral-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform">
                        {item.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-rust-700">{item.label}</p>
                        <p className="text-gray-500 text-sm">{item.desc}</p>
                      </div>
                      {settingsLoading && settingsType === item.type ? (
                        <svg className="w-5 h-5 animate-spin text-rust-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-rust-500 flex-shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      )}
                    </button>
                  ))}

                  {/* Current credentials info */}
                  <div className="mt-6 p-4 bg-cream-50 rounded-xl border border-cream-200">
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Current Account</p>
                    <p className="text-sm text-gray-700">👤 <span className="font-semibold">{admin?.username}</span></p>
                    <p className="text-sm text-gray-700 mt-1">📧 <span className="font-semibold">{admin?.email}</span></p>
                    <p className="text-xs text-gray-400 mt-2">📱 OTP will be sent to: +91 88266 28029 & +91 99716 70277</p>
                  </div>
                </div>
              )}

              {/* STEP 2: Enter OTP */}
              {settingsStep === 'otp' && (
                <div className="space-y-5">
                  <div className="text-center py-2">
                    <div className="text-5xl mb-3">📱</div>
                    <h3 className="text-lg font-bold text-rust-700">OTP Sent!</h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Enter the 6-digit OTP sent to your registered phone numbers
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Expires in 5 minutes</p>
                  </div>

                  {/* OTP Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Enter OTP *</label>
                    <input
                      type="number"
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.slice(0, 6))}
                      placeholder="Enter 6-digit OTP"
                      className="w-full px-4 py-3 border-2 border-cream-300 rounded-xl text-center text-2xl font-bold tracking-widest focus:outline-none focus:border-rust-400 transition-colors"
                      maxLength={6}
                    />
                  </div>

                  {/* New Value Input */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                      New {settingsType.charAt(0).toUpperCase() + settingsType.slice(1)} *
                    </label>
                    {settingsType === 'password' ? (
                      <div className="relative">
                        <input
                          type={showNewPass ? 'text' : 'password'}
                          value={newValue}
                          onChange={(e) => setNewValue(e.target.value)}
                          placeholder="Enter new password (min 6 chars)"
                          className="w-full px-4 py-3 pr-12 border-2 border-cream-300 rounded-xl focus:outline-none focus:border-rust-400 transition-colors"
                        />
                        <button type="button" onClick={() => setShowNewPass(!showNewPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showNewPass ? '🙈' : '👁️'}
                        </button>
                      </div>
                    ) : (
                      <input
                        type={settingsType === 'email' ? 'email' : 'text'}
                        value={newValue}
                        onChange={(e) => setNewValue(e.target.value)}
                        placeholder={`Enter new ${settingsType}`}
                        className="w-full px-4 py-3 border-2 border-cream-300 rounded-xl focus:outline-none focus:border-rust-400 transition-colors"
                      />
                    )}
                  </div>

                  {/* Current Password (only for password change) */}
                  {settingsType === 'password' && (
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">Current Password *</label>
                      <div className="relative">
                        <input
                          type={showCurrPass ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Enter current password"
                          className="w-full px-4 py-3 pr-12 border-2 border-cream-300 rounded-xl focus:outline-none focus:border-rust-400 transition-colors"
                        />
                        <button type="button" onClick={() => setShowCurrPass(!showCurrPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showCurrPass ? '🙈' : '👁️'}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={resetSettings}
                      className="flex-1 py-3 border-2 border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={handleVerifyAndUpdate}
                      disabled={settingsLoading}
                      className="flex-1 py-3 bg-gradient-to-r from-rust-500 to-rust-600 text-white rounded-xl font-bold hover:from-rust-600 hover:to-rust-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {settingsLoading ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                          </svg>
                          Verifying...
                        </>
                      ) : (
                        '✅ Verify & Update'
                      )}
                    </button>
                  </div>

                  {/* Resend OTP */}
                  <div className="text-center">
                    <button
                      onClick={() => handleRequestOTP(settingsType)}
                      disabled={settingsLoading}
                      className="text-sm text-rust-600 hover:text-rust-700 underline disabled:opacity-50"
                    >
                      Resend OTP
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default Admin;
