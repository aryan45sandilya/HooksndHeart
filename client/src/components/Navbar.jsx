import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUser } from '../context/UserContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, admin, logout } = useAuth();
  const { user, cartCount, logout: userLogout, isAuthenticated: isUserAuthenticated } = useUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const handleUserLogout = () => {
    userLogout();
    setShowUserMenu(false);
    setIsOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-cream-50/95 backdrop-blur-md shadow-xl' 
        : 'bg-cream-50 shadow-lg'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-coral-400 to-golden-400 rounded-full blur-lg opacity-0 group-hover:opacity-50 transition-opacity duration-300"></div>
              <div className="relative w-16 h-16 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-all duration-300 shadow-xl overflow-hidden bg-gradient-to-br from-cream-100 to-golden-100 border-2 border-rust-200 p-1">
                <div className="w-full h-full rounded-full bg-white flex items-center justify-center p-1">
                  <img 
                    src="/logo.png" 
                    alt="Hooks & Heart Logo" 
                    className="w-full h-full object-contain"
                    style={{ objectFit: 'contain', objectPosition: 'center' }}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-display font-bold text-rust-600 flex items-center gap-1">
                Hooks & Heart <span className="text-2xl animate-pulse">💛</span>
              </span>
              <span className="text-xs text-rust-400 font-medium tracking-wider">HAND MADE WITH LOVE</span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <NavLink to="/" isActive={isActive('/')}>
              Home
            </NavLink>
            <NavLink to="/products" isActive={isActive('/products')}>
              Products
            </NavLink>
            <NavLink to="/contact" isActive={isActive('/contact')}>
              Contact
            </NavLink>
            
            {/* User Actions */}
            <div className="ml-4 flex items-center space-x-3">
              {/* Cart Icon */}
              <Link 
                to="/cart" 
                className="relative p-2 text-rust-600 hover:text-rust-700 transition-colors"
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-coral-500 to-rust-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* User Menu or Login Button */}
              {isUserAuthenticated ? (
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2.5 rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span>{user?.name?.split(' ')[0]}</span>
                    <svg className={`w-4 h-4 transition-transform ${showUserMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl py-2 z-50 animate-scale-in">
                      <Link
                        to="/my-orders"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-cream-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                        <span className="text-gray-700 font-medium">My Orders</span>
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-cream-100 transition-colors"
                      >
                        <svg className="w-5 h-5 text-rust-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span className="text-gray-700 font-medium">My Profile</span>
                      </Link>
                      <hr className="my-2" />
                      <button
                        onClick={handleUserLogout}
                        className="flex items-center space-x-3 px-4 py-3 hover:bg-red-50 transition-colors w-full text-left"
                      >
                        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span className="text-red-600 font-medium">Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/user-login"
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-2.5 rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Login
                </Link>
              )}

              {/* Admin link hidden - only show if already logged in */}
              {isAuthenticated && (
                <div className="flex items-center space-x-3 ml-2 pl-2 border-l-2 border-gray-300">
                  <Link 
                    to="/admin" 
                    className="bg-gradient-to-r from-rust-500 to-rust-600 text-cream-50 px-6 py-2.5 rounded-full font-semibold hover:scale-105 hover:shadow-xl transition-all duration-300 active:scale-95"
                  >
                    👤 {admin?.username}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2.5 rounded-full font-semibold hover:scale-105 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden relative w-10 h-10 text-rust-600 hover:text-rust-700 focus:outline-none"
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-[600px] pb-6' : 'max-h-0'
        }`}>
          <div className="space-y-2 pt-2">
            <MobileNavLink to="/" onClick={() => setIsOpen(false)} isActive={isActive('/')}>
              🏠 Home
            </MobileNavLink>
            <MobileNavLink to="/products" onClick={() => setIsOpen(false)} isActive={isActive('/products')}>
              🛍️ Products
            </MobileNavLink>
            <MobileNavLink to="/contact" onClick={() => setIsOpen(false)} isActive={isActive('/contact')}>
              📧 Contact
            </MobileNavLink>
            
            {/* Cart Link */}
            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive('/cart')
                  ? 'bg-gradient-to-r from-rust-100 to-coral-100 text-rust-700'
                  : 'text-gray-700 hover:bg-cream-200'
              }`}
            >
              <span>🛒 Cart</span>
              {cartCount > 0 && (
                <span className="bg-gradient-to-r from-coral-500 to-rust-500 text-white text-xs font-bold rounded-full px-2 py-1">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* User Menu */}
            {isUserAuthenticated ? (
              <>
                <div className="pt-2 border-t-2 border-gray-200 mt-2">
                  <p className="px-4 py-2 text-sm text-gray-500 font-semibold">
                    Hello, {user?.name?.split(' ')[0]}!
                  </p>
                  <MobileNavLink to="/my-orders" onClick={() => setIsOpen(false)} isActive={isActive('/my-orders')}>
                    📦 My Orders
                  </MobileNavLink>
                  <MobileNavLink to="/profile" onClick={() => setIsOpen(false)} isActive={isActive('/profile')}>
                    👤 My Profile
                  </MobileNavLink>
                  <button
                    onClick={handleUserLogout}
                    className="block w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 transition-all duration-200 mt-2"
                  >
                    🚪 Logout
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/user-login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center bg-gradient-to-r from-teal-500 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold mt-4 hover:scale-105 transition-transform"
              >
                Login / Register
              </Link>
            )}
            
            {/* Admin link hidden - only show if already logged in */}
            {isAuthenticated && (
              <>
                <div className="pt-2 border-t-2 border-gray-200 mt-2">
                  <Link
                    to="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full text-center bg-gradient-to-r from-rust-500 to-rust-600 text-cream-50 px-6 py-3 rounded-xl font-semibold mt-2 hover:scale-105 transition-transform"
                  >
                    👤 {admin?.username} Panel
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-center bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold mt-2"
                  >
                    Admin Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

// Desktop Nav Link Component
function NavLink({ to, children, isActive }) {
  return (
    <Link
      to={to}
      className={`relative px-4 py-2 font-medium transition-all duration-300 group ${
        isActive ? 'text-rust-600' : 'text-gray-700 hover:text-rust-600'
      }`}
    >
      {children}
      <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-rust-500 to-coral-500 transform origin-left transition-transform duration-300 ${
        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
      }`}></span>
    </Link>
  );
}

// Mobile Nav Link Component
function MobileNavLink({ to, children, onClick, isActive }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`block px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
        isActive 
          ? 'bg-gradient-to-r from-rust-100 to-coral-100 text-rust-700' 
          : 'text-gray-700 hover:bg-cream-200'
      }`}
    >
      {children}
    </Link>
  );
}

export default Navbar;
