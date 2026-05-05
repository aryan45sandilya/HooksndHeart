import { useState, useEffect, useMemo } from 'react';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    { value: '', label: 'All', icon: '🎨' },
    { value: 'bags', label: 'Bags', icon: '👜' },
    { value: 'toys', label: 'Toys', icon: '🧸' },
    { value: 'home-decor', label: 'Home Decor', icon: '🏠' },
    { value: 'accessories', label: 'Accessories', icon: '💍' },
    { value: 'clothing', label: 'Clothing', icon: '👗' },
    { value: 'other', label: 'Other', icon: '🎁' }
  ];

  const sortOptions = [
    { value: 'newest', label: '🆕 Newest First' },
    { value: 'oldest', label: '📅 Oldest First' },
    { value: 'price-low', label: '💰 Price: Low to High' },
    { value: 'price-high', label: '💎 Price: High to Low' },
    { value: 'name-az', label: '🔤 Name: A to Z' },
    { value: 'name-za', label: '🔤 Name: Z to A' },
    { value: 'featured', label: '⭐ Featured First' },
  ];

  useEffect(() => {
    fetchProducts();
  }, []);

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

  // All filtering + sorting done client-side
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // Category
    if (selectedCategory) {
      result = result.filter(p => p.category === selectedCategory);
    }

    // In stock
    if (inStockOnly) {
      result = result.filter(p => p.inStock);
    }

    // Featured
    if (featuredOnly) {
      result = result.filter(p => p.featured);
    }

    // Price range
    if (priceRange.min !== '') {
      result = result.filter(p => p.price >= Number(priceRange.min));
    }
    if (priceRange.max !== '') {
      result = result.filter(p => p.price <= Number(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'name-az':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-za':
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'featured':
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    return result;
  }, [products, searchQuery, selectedCategory, inStockOnly, featuredOnly, priceRange, sortBy]);

  const activeFilterCount = [
    selectedCategory !== '',
    inStockOnly,
    featuredOnly,
    priceRange.min !== '',
    priceRange.max !== '',
    searchQuery.trim() !== '',
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setSelectedCategory('');
    setSortBy('newest');
    setPriceRange({ min: '', max: '' });
    setInStockOnly(false);
    setFeaturedOnly(false);
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-rust-500 via-rust-600 to-rust-500 text-white py-8 md:py-10 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-golden-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-2 animate-bounce-slow">
            <span className="text-4xl md:text-5xl">🧶</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-display font-bold mb-3 animate-slide-up">
            Our Collection
          </h1>
          <p className="text-base md:text-lg text-cream-100 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Explore our handcrafted treasures, each piece made with love and care
          </p>

          {/* Search Bar in Hero */}
          <div className="mt-5 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full px-6 py-4 pr-14 rounded-2xl text-gray-800 text-base font-medium shadow-2xl focus:outline-none focus:ring-4 focus:ring-white/30"
              />
              {searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xl">✕</button>
              ) : (
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">🔍</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">

        {/* Category Pills */}
        <div className="mb-6 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <div className="flex gap-2 sm:gap-3 sm:flex-wrap min-w-max sm:min-w-0">
            {categories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-semibold text-sm whitespace-nowrap transition-all duration-200 hover:scale-105 active:scale-95 ${
                  selectedCategory === cat.value
                    ? 'bg-gradient-to-r from-rust-500 to-rust-600 text-white shadow-lg shadow-rust-500/30'
                    : 'bg-white text-rust-600 border-2 border-cream-200 hover:border-rust-300 shadow-sm'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sort + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Sort Dropdown */}
          <div className="relative flex-1 sm:max-w-xs">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full appearance-none bg-white border-2 border-cream-200 text-gray-700 font-semibold px-4 py-3 pr-10 rounded-xl shadow-sm focus:outline-none focus:border-rust-400 cursor-pointer text-sm"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">▼</span>
          </div>

          {/* Filter Toggle Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-sm border-2 transition-all duration-200 ${
              showFilters || activeFilterCount > 0
                ? 'bg-rust-500 text-white border-rust-500 shadow-lg'
                : 'bg-white text-rust-600 border-cream-200 hover:border-rust-300'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
            </svg>
            Filters
            {activeFilterCount > 0 && (
              <span className="bg-white text-rust-600 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Results count */}
          <div className="flex items-center justify-center sm:justify-end sm:ml-auto">
            <p className="text-sm text-gray-500">
              <span className="font-bold text-rust-600 text-base">{filteredProducts.length}</span>
              <span className="ml-1">{filteredProducts.length === 1 ? 'product' : 'products'}</span>
            </p>
          </div>
        </div>

        {/* Expandable Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-2xl shadow-lg border border-cream-200 p-5 mb-6 animate-scale-in">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-rust-700 text-base flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
                </svg>
                Advanced Filters
              </h3>
              {activeFilterCount > 0 && (
                <button onClick={clearAllFilters} className="text-sm text-red-500 hover:text-red-600 font-semibold flex items-center gap-1">
                  ✕ Clear All
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {/* Price Range */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">💰 Price Range (₹)</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange(p => ({ ...p, min: e.target.value }))}
                    placeholder="Min"
                    min="0"
                    className="w-full px-3 py-2.5 border-2 border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rust-400"
                  />
                  <span className="text-gray-400 font-bold">—</span>
                  <input
                    type="number"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange(p => ({ ...p, max: e.target.value }))}
                    placeholder="Max"
                    min="0"
                    className="w-full px-3 py-2.5 border-2 border-cream-200 rounded-xl text-sm focus:outline-none focus:border-rust-400"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">📦 Availability</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setInStockOnly(!inStockOnly)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        inStockOnly ? 'bg-rust-500 border-rust-500' : 'border-gray-300 group-hover:border-rust-400'
                      }`}
                    >
                      {inStockOnly && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">In Stock Only</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div
                      onClick={() => setFeaturedOnly(!featuredOnly)}
                      className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                        featuredOnly ? 'bg-rust-500 border-rust-500' : 'border-gray-300 group-hover:border-rust-400'
                      }`}
                    >
                      {featuredOnly && <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">⭐ Featured Only</span>
                  </label>
                </div>
              </div>

              {/* Quick Price Presets */}
              <div>
                <label className="block text-sm font-bold text-gray-600 mb-2">🏷️ Quick Price Filter</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'Under ₹200', min: '', max: '200' },
                    { label: '₹200–₹500', min: '200', max: '500' },
                    { label: '₹500–₹1000', min: '500', max: '1000' },
                    { label: 'Above ₹1000', min: '1000', max: '' },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => setPriceRange({ min: preset.min, max: preset.max })}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                        priceRange.min === preset.min && priceRange.max === preset.max
                          ? 'bg-rust-500 text-white border-rust-500'
                          : 'bg-cream-50 text-rust-600 border-cream-200 hover:border-rust-300'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Filter Tags */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {searchQuery && (
              <FilterTag label={`Search: "${searchQuery}"`} onRemove={() => setSearchQuery('')} />
            )}
            {selectedCategory && (
              <FilterTag label={`Category: ${categories.find(c => c.value === selectedCategory)?.label}`} onRemove={() => setSelectedCategory('')} />
            )}
            {inStockOnly && <FilterTag label="In Stock Only" onRemove={() => setInStockOnly(false)} />}
            {featuredOnly && <FilterTag label="⭐ Featured Only" onRemove={() => setFeaturedOnly(false)} />}
            {priceRange.min && <FilterTag label={`Min: ₹${priceRange.min}`} onRemove={() => setPriceRange(p => ({ ...p, min: '' }))} />}
            {priceRange.max && <FilterTag label={`Max: ₹${priceRange.max}`} onRemove={() => setPriceRange(p => ({ ...p, max: '' }))} />}
            <button onClick={clearAllFilters} className="px-3 py-1 rounded-full text-xs font-bold text-red-500 border-2 border-red-200 hover:bg-red-50 transition-colors">
              Clear All ✕
            </button>
          </div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col justify-center items-center py-20">
            <div className="relative mb-6">
              <div className="w-20 h-20 border-8 border-cream-300 border-t-rust-500 rounded-full animate-spin"></div>
              <span className="absolute inset-0 flex items-center justify-center text-2xl animate-pulse">🧶</span>
            </div>
            <p className="text-xl text-gray-600 font-medium">Loading beautiful creations...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 md:gap-8">
            {filteredProducts.map((product, index) => (
              <div
                key={product._id}
                className="animate-scale-in"
                style={{ animationDelay: `${Math.min(index * 0.05, 0.3)}s` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-7xl mb-6 animate-bounce-slow">🔍</div>
            <h3 className="text-2xl md:text-3xl font-display font-bold text-rust-600 mb-3">No Products Found</h3>
            <p className="text-gray-600 mb-8">Try adjusting your filters or search query</p>
            <button
              onClick={clearAllFilters}
              className="px-8 py-4 bg-gradient-to-r from-rust-500 to-rust-600 text-white rounded-2xl font-bold hover:scale-105 transition-all duration-300 shadow-xl"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Tag Component
function FilterTag({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rust-100 text-rust-700 rounded-full text-xs font-semibold border border-rust-200">
      {label}
      <button onClick={onRemove} className="hover:text-rust-900 transition-colors font-bold">✕</button>
    </span>
  );
}

export default Products;
