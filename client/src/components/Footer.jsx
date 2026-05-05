import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-rust-600 via-rust-500 to-rust-600 text-white mt-8 relative overflow-hidden">
      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">

        {/* Mobile: compact single column | Desktop: 3 columns */}
        
        {/* Mobile Layout */}
        <div className="flex flex-col items-center gap-2 sm:hidden">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-display font-bold text-sm">Hooks & Heart <span className="animate-pulse">💛</span></span>
          </div>
          {/* Links in one row */}
          <div className="flex items-center gap-3 text-xs text-cream-100 flex-wrap justify-center">
            <Link to="/" className="hover:text-golden-300">Home</Link>
            <Link to="/products" className="hover:text-golden-300">Products</Link>
            <Link to="/contact" className="hover:text-golden-300">Contact</Link>
            <a href="https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq" target="_blank" rel="noopener noreferrer" className="hover:text-golden-300">Instagram</a>
          </div>
          {/* Contact in one row */}
          <div className="flex items-center gap-3 text-xs text-cream-200 flex-wrap justify-center">
            <a href="tel:+918826628029" className="hover:text-golden-300">📱 88266 28029</a>
            <a href="tel:+919971670277" className="hover:text-golden-300">📱 99716 70277</a>
          </div>
          <p className="text-cream-200 text-xs">&copy; {currentYear} Hooks & Heart. Made with <span className="text-golden-300">❤️</span></p>
        </div>

        {/* Desktop Layout */}
        <div className="hidden sm:grid sm:grid-cols-3 gap-4 mb-3">
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center p-0.5">
                <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
              </div>
              <span className="font-display font-bold text-sm">Hooks & Heart <span className="animate-pulse">💛</span></span>
            </div>
            <p className="text-xs text-cream-200 tracking-wider">HAND MADE WITH LOVE</p>
            <a href="https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq" target="_blank" rel="noopener noreferrer"
              className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all hover:scale-110">
              <span className="text-xs">📷</span>
            </a>
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <p className="font-bold text-xs text-golden-300 mb-1">Quick Links</p>
            <Link to="/" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">🏠 Home</Link>
            <Link to="/products" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">🛍️ Products</Link>
            <Link to="/contact" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">📧 Contact Us</Link>
            <a href="https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq" target="_blank" rel="noopener noreferrer" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">📷 Instagram</a>
          </div>
          <div className="flex flex-col items-start gap-1.5">
            <p className="font-bold text-xs text-golden-300 mb-1">Get in Touch</p>
            <a href="tel:+918826628029" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">📱 +91 88266 28029</a>
            <a href="tel:+919971670277" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">📱 +91 99716 70277</a>
            <a href="https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq" target="_blank" rel="noopener noreferrer" className="text-xs text-cream-100 hover:text-golden-300 transition-colors">📷 @hooksndheart</a>
          </div>
        </div>

        {/* Desktop bottom line */}
        <div className="hidden sm:block border-t border-white/10 pt-3 text-center">
          <p className="text-cream-200 text-xs">&copy; {currentYear} Hooks & Heart. All rights reserved. Made with <span className="text-golden-300 animate-pulse">❤️</span> and 🧶</p>
        </div>

      </div>
    </footer>
  );
}

// Social Icon Component
function SocialIcon({ icon, label }) {
  return (
    <button 
      className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:-translate-y-1"
      aria-label={label}
    >
      <span className="text-lg">{icon}</span>
    </button>
  );
}

// Footer Link Component
function FooterLink({ to, icon, children }) {
  return (
    <li>
      <Link 
        to={to} 
        className="flex items-center text-cream-100 hover:text-golden-300 transition-all duration-200 hover:translate-x-2 group"
      >
        <span className="mr-2 group-hover:scale-125 transition-transform">{icon}</span>
        {children}
      </Link>
    </li>
  );
}

// Contact Item Component
function ContactItem({ icon, text }) {
  return (
    <li className="flex items-start text-cream-100">
      <span className="mr-3 text-lg mt-0.5">{icon}</span>
      <span>{text}</span>
    </li>
  );
}

export default Footer;
