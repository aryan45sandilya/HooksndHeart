import { Link } from 'react-router-dom';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-rust-600 via-rust-500 to-rust-600 text-white mt-8">
      <div className="max-w-5xl mx-auto px-4 py-4">

        {/* Single compact layout for all screens */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

          {/* Brand */}
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center p-0.5 flex-shrink-0">
              <img src="/logo.png" alt="Logo" className="w-full h-full object-contain rounded-full" />
            </div>
            <span className="font-bold text-sm">Hooks & Heart <span className="animate-pulse">💛</span></span>
          </div>

          {/* Links */}
          <div className="flex items-center justify-center gap-3 flex-wrap text-xs text-cream-100">
            <Link to="/" className="hover:text-golden-300 transition-colors">Home</Link>
            <Link to="/products" className="hover:text-golden-300 transition-colors">Products</Link>
            <Link to="/contact" className="hover:text-golden-300 transition-colors">Contact</Link>
            <a href="https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq" target="_blank" rel="noopener noreferrer" className="hover:text-golden-300 transition-colors">📷 Instagram</a>
          </div>

          {/* Phone */}
          <div className="flex items-center justify-center gap-3 text-xs text-cream-100">
            <a href="tel:+918826628029" className="hover:text-golden-300 transition-colors">📱 88266 28029</a>
            <a href="tel:+919971670277" className="hover:text-golden-300 transition-colors">📱 99716 70277</a>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-white/10 mt-3 pt-3 text-center">
          <p className="text-cream-200 text-xs">&copy; {currentYear} Hooks & Heart. Made with <span className="text-golden-300">❤️</span> and 🧶</p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;
