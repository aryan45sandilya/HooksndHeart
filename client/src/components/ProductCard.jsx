import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getImageUrl } from '../services/api';
import { useUser } from '../context/UserContext';

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addToCart, isAuthenticated } = useUser();
  const [isAdding, setIsAdding] = useState(false);
  const imageUrl = product.images && product.images.length > 0 
    ? getImageUrl(product.images[0].url)
    : 'https://via.placeholder.com/400x400?text=No+Image';

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/user-login');
      return;
    }

    if (!product.inStock) return;

    setIsAdding(true);
    const result = await addToCart(product._id, 1);
    
    if (result.success) {
      // Show success animation
      setTimeout(() => setIsAdding(false), 1000);
    } else {
      setIsAdding(false);
      alert(result.message);
    }
  };

  return (
    <div className="group block relative">
      <div className="card relative overflow-hidden">
        <Link to={`/products/${product._id}`}>
          {/* Image Container */}
          <div className="aspect-square overflow-hidden bg-gradient-to-br from-cream-100 to-golden-50 relative">
            <img
              src={imageUrl}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Overlay on Hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-rust-900/80 via-rust-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
              <span className="text-white font-semibold flex items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                View Details
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </div>

            {/* Featured Badge */}
            {product.featured && (
              <div className="absolute top-4 right-4 bg-gradient-to-r from-golden-400 to-golden-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center animate-bounce-slow">
                <span className="mr-1">⭐</span>
                Featured
              </div>
            )}

            {/* Out of Stock Badge */}
            {!product.inStock && (
              <div className="absolute top-4 left-4 bg-gray-900/90 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                Out of Stock
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5 bg-white">
            <h3 className="text-lg font-display font-bold text-rust-700 mb-2 line-clamp-1 group-hover:text-rust-600 transition-colors">
              {product.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            
            <div className="flex justify-between items-center mb-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold bg-gradient-to-r from-rust-600 to-coral-500 bg-clip-text text-transparent">
                  ₹{product.price}
                </span>
                {product.inStock && (
                  <span className="text-xs text-green-600 font-medium flex items-center mt-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></span>
                    In Stock
                  </span>
                )}
              </div>
              
              <div className="w-10 h-10 bg-gradient-to-br from-rust-500 to-coral-500 rounded-full flex items-center justify-center text-white group-hover:scale-110 group-hover:rotate-12 transition-all duration-300 shadow-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </div>
            </div>

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-1">
                {product.tags.slice(0, 2).map((tag, index) => (
                  <span 
                    key={index} 
                    className="text-xs bg-cream-100 text-rust-600 px-2 py-1 rounded-full"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Link>

        {/* Add to Cart Button */}
        <div className="px-5 pb-5 bg-white">
          <button
            onClick={handleAddToCart}
            disabled={!product.inStock || isAdding}
            className={`w-full py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 ${
              !product.inStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : isAdding
                ? 'bg-green-500 text-white scale-95'
                : 'bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:from-teal-600 hover:to-teal-700 hover:scale-105 hover:shadow-lg active:scale-95'
            }`}
          >
            {isAdding ? (
              <>
                <svg className="w-5 h-5 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Added!</span>
              </>
            ) : !product.inStock ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
