import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await productAPI.getAll({ featured: true });
      setFeaturedProducts(response.data.data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section - Ultra Modern */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-cream-100 via-golden-50 to-coral-50 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0">
          <div className="absolute top-20 -left-20 w-96 h-96 bg-gradient-to-br from-coral-300/30 to-golden-300/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-gradient-to-br from-teal-300/30 to-rust-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s', animationDuration: '4s' }}></div>
          <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-gradient-to-br from-golden-300/30 to-coral-300/30 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s', animationDuration: '5s' }}></div>
          
          {/* Floating Yarn Balls */}
          <div className="absolute top-1/4 left-10 text-6xl opacity-20 animate-float" style={{ animationDuration: '6s' }}>🧶</div>
          <div className="absolute top-1/3 right-20 text-5xl opacity-20 animate-float" style={{ animationDelay: '1s', animationDuration: '7s' }}>🧵</div>
          <div className="absolute bottom-1/4 right-1/4 text-7xl opacity-20 animate-float" style={{ animationDelay: '2s', animationDuration: '8s' }}>🎨</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-8 animate-slide-up">
              {/* Badge */}
              <div className="inline-flex items-center space-x-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg border border-rust-200">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-sm font-semibold text-rust-600">✨ Handcrafted with Love</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-display font-bold leading-tight">
                <span className="block text-rust-600 mb-2">Hooks</span>
                <span className="block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 via-golden-500 to-teal-500">
                    & Heart
                  </span>
                  <span className="text-6xl md:text-7xl ml-3 inline-block animate-pulse">💛</span>
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-xl">
                Where every stitch tells a story. Discover unique, handmade crochet creations that bring warmth to your world.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link 
                  to="/products" 
                  className="group relative px-10 py-5 bg-gradient-to-r from-rust-500 via-rust-600 to-rust-500 text-white rounded-2xl font-bold text-lg overflow-hidden shadow-2xl hover:shadow-rust-500/50 transition-all duration-300 hover:scale-105 active:scale-95"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-rust-600 via-rust-500 to-rust-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="relative flex items-center justify-center">
                    Explore Collection
                    <svg className="w-6 h-6 ml-2 group-hover:translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </span>
                </Link>
                
                <Link 
                  to="/contact" 
                  className="px-10 py-5 bg-white/90 backdrop-blur-sm text-rust-600 rounded-2xl font-bold text-lg border-2 border-rust-200 hover:border-rust-400 hover:bg-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center"
                >
                  <span className="mr-2">💬</span>
                  Custom Order
                </Link>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 justify-center lg:justify-start pt-8">
                <StatItem number="500+" label="Happy Customers" />
                <StatItem number="1000+" label="Products Made" />
                <StatItem number="100%" label="Handcrafted" />
              </div>
            </div>

            {/* Right Content - Product Collage */}
            <div className="relative animate-scale-in" style={{ animationDelay: '0.2s' }}>
              <div className="relative group">
                {/* Glow Effect */}
                <div className="absolute -inset-4 bg-gradient-to-r from-coral-400 via-golden-400 to-teal-400 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                
                {/* Collage Card */}
                <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-cream-200">
                  {/* 3x3 Collage Grid - uniform aspect ratio */}
                  <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden">
                    <div className="col-span-2 row-span-2 relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img src="/products/product2.jpg" alt="Rose Bouquet" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img src="/products/product1.jpg" alt="Lily Pot" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img src="/products/product8.jpg" alt="Yellow Flower" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img src="/products/product7.jpg" alt="Heart Keychains" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img src="/products/product5.jpg" alt="Phone Charm" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="relative rounded-xl overflow-hidden" style={{ aspectRatio: '1/1' }}>
                      <img src="/products/product6.jpg" alt="Cherry Charm" className="absolute inset-0 w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                    </div>
                  </div>

                  {/* Floating badges */}
                  <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg animate-float">
                    <span className="text-xs font-bold text-rust-600">⭐ Premium Quality</span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg animate-float" style={{ animationDelay: '1s' }}>
                    <span className="text-xs font-bold text-rust-600">🎨 Unique Designs</span>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-coral-400 to-golden-400 rounded-full opacity-20 blur-xl"></div>
                  <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-teal-400 to-rust-400 rounded-full opacity-20 blur-xl"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm text-rust-600 font-medium">Scroll to explore</span>
            <svg className="w-6 h-6 text-rust-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Features Section - Modern Cards */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <h2 className="text-5xl md:text-6xl font-display font-bold text-rust-600 mb-4">
              Why Choose Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Every piece is crafted with passion, precision, and a whole lot of love
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ModernFeatureCard 
              icon="✨" 
              title="Premium Quality" 
              description="Only the finest materials and techniques for lasting beauty"
              color="from-coral-400 to-coral-600"
              delay="0s"
            />
            <ModernFeatureCard 
              icon="🎨" 
              title="Unique Designs" 
              description="One-of-a-kind patterns you won't find anywhere else"
              color="from-golden-400 to-golden-600"
              delay="0.1s"
            />
            <ModernFeatureCard 
              icon="💝" 
              title="Made with Love" 
              description="Every stitch carries our passion and dedication"
              color="from-teal-400 to-teal-600"
              delay="0.2s"
            />
          </div>
        </div>
      </section>

      {/* Featured Products - Premium Grid */}
      <section className="py-24 bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #C85A3E 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-slide-up">
            <div className="inline-block mb-4">
              <span className="bg-gradient-to-r from-rust-500 to-coral-500 text-white px-6 py-2 rounded-full text-sm font-bold">
                ⭐ FEATURED COLLECTION
              </span>
            </div>
            <h2 className="text-5xl md:text-6xl font-display font-bold text-rust-600 mb-4">
              Our Masterpieces
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Handpicked creations that showcase the art of crochet
            </p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="relative">
                <div className="w-24 h-24 border-8 border-cream-300 border-t-rust-500 rounded-full animate-spin"></div>
                <span className="absolute inset-0 flex items-center justify-center text-3xl animate-pulse">🧶</span>
              </div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product, index) => (
                <div 
                  key={product._id} 
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            /* Photo Collage Grid - shown when no DB products */
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-5">
              {[
                { src: '/products/product2.jpg', span: 'col-span-2 md:col-span-1' },
                { src: '/products/product1.jpg', span: '' },
                { src: '/products/product8.jpg', span: '' },
                { src: '/products/product3.jpg', span: '' },
                { src: '/products/product7.jpg', span: '' },
                { src: '/products/product6.jpg', span: '' },
                { src: '/products/product4.jpg', span: '' },
                { src: '/products/product13.jpg', span: '' },
                { src: '/products/product12.jpg', span: '' },
              ].map((item, i) => (
                <div key={i} className={`relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 ${item.span}`} style={{ aspectRatio: '1/1' }}>
                  <img src={item.src} alt={`Product ${i+1}`} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-16 animate-fade-in">
            <Link 
              to="/products" 
              className="inline-flex items-center px-12 py-5 bg-gradient-to-r from-rust-500 to-rust-600 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-rust-500/50 transition-all duration-300 active:scale-95"
            >
              View Full Collection
              <svg className="w-6 h-6 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Designs Gallery - just above footer */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(circle, #C85A3E 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-slide-up">
            <div className="inline-block mb-3">
              <span className="bg-gradient-to-r from-golden-500 to-coral-500 text-white px-5 py-1.5 rounded-full text-sm font-bold tracking-wider">
                🎨 OUR DESIGNS
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-rust-600 mb-3">
              Unique Designs
            </h2>
            <p className="text-lg text-gray-500 max-w-xl mx-auto">
              Each piece tells its own story — crafted with yarn, patience & love 🧶
            </p>
          </div>

          {/* 7-image uniform grid - perfect square fit */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">

            {/* Big featured - spans 2 cols & 2 rows */}
            <div
              className="col-span-2 row-span-2 relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src="/products/clean1.jpg"
                alt="Design"
                className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>

            {/* Top right 2 */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/clean2.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product15.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

            {/* Bottom row - 4 equal */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product9.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product10.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product5.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product11.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product12.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>
            <div className="relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ aspectRatio: '1 / 1' }}>
              <img src="/products/product16.jpg" alt="Design" className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
            </div>

          </div>

          <div className="text-center mt-10">
            <Link to="/products" className="inline-flex items-center px-10 py-4 bg-gradient-to-r from-rust-500 to-coral-500 text-white rounded-2xl font-bold text-base hover:scale-105 hover:shadow-xl hover:shadow-rust-500/40 transition-all duration-300 active:scale-95">
              <span className="mr-2">🛍️</span> Shop All Designs
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* By the Artist Section - Compact */}
      <section className="py-14 bg-gradient-to-br from-cream-50 via-golden-50/40 to-coral-50/20 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-coral-300/20 to-golden-300/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-72 h-72 bg-gradient-to-br from-teal-300/20 to-rust-300/20 rounded-full blur-3xl"></div>
        </div>
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-cream-200 overflow-hidden">
            <div className="h-1 w-full bg-gradient-to-r from-coral-400 via-golden-400 to-teal-400"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="relative overflow-hidden" style={{ minHeight: '380px' }}>
                <img src="/products/artist.jpg" alt="The Artist - Hooks & Heart" className="w-full h-full object-cover object-center" style={{ minHeight: '380px' }} />
                <div className="absolute inset-0 bg-gradient-to-t from-rust-900/40 via-transparent to-transparent"></div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg animate-float">
                  <span className="text-xs font-bold text-rust-600">✨ Handmade with Love</span>
                </div>
                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-lg animate-float" style={{ animationDelay: '1.5s' }}>
                  <span className="text-xs font-bold text-rust-600">🧶 Hooks & Heart 💛</span>
                </div>
              </div>
              <div className="flex flex-col justify-center px-8 py-10 space-y-5">
                <div>
                  <p className="text-xs font-bold tracking-widest text-coral-500 uppercase mb-2">— By the Artist</p>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-rust-600 leading-tight">
                    Every Stitch is a <span className="text-transparent bg-clip-text bg-gradient-to-r from-coral-500 to-golden-500">Little Piece</span> of My Heart
                  </h2>
                </div>
                <div className="relative pl-5 border-l-4 border-coral-400">
                  <span className="absolute -top-2 -left-2 text-4xl text-coral-300 font-serif leading-none">"</span>
                  <p className="text-base text-gray-700 leading-relaxed italic">
                    I started crocheting because I wanted to create something that lasts — something you can hold, feel, and cherish. Every flower, every charm is made with my own hands and a whole lot of love.
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <span className="text-xl mt-0.5">💛</span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      <span className="font-bold text-rust-600">To my customers —</span> thank you for trusting me with your special moments. I pour my heart into every single piece.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-xl mt-0.5">🧶</span>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      Custom orders are always welcome — your vision deserves to come to life, one stitch at a time.
                    </p>
                  </div>
                </div>
                <div className="pt-3 border-t border-cream-300">
                  <p className="text-gray-400 text-xs mb-1">With love & yarn,</p>
                  <p className="text-xl font-display font-bold text-rust-600">Hooks & Heart 💛</p>
                  <p className="text-xs text-gray-400">@hooksndheart</p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link to="/products" className="inline-flex items-center px-6 py-2.5 bg-gradient-to-r from-rust-500 to-coral-500 text-white rounded-xl font-bold text-sm hover:scale-105 hover:shadow-lg transition-all duration-300">
                    <span className="mr-1.5">🛍️</span> Shop Now
                  </Link>
                  <Link to="/contact" className="inline-flex items-center px-6 py-2.5 bg-white border-2 border-rust-300 text-rust-600 rounded-xl font-bold text-sm hover:scale-105 hover:border-rust-500 transition-all duration-300">
                    <span className="mr-1.5">💬</span> Custom Order
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Bold & Eye-catching */}
      <section className="py-6 bg-gradient-to-br from-rust-500 via-rust-600 to-rust-700 text-white relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-golden-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-5xl mb-4 animate-float">🎁</div>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 animate-slide-up">
            Ready for Something Special?
          </h2>
          <p className="text-lg md:text-xl mb-8 text-cream-100 animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Let's create a custom masterpiece just for you!
          </p>
          <Link 
            to="/contact" 
            className="inline-flex items-center px-12 py-6 bg-white text-rust-600 rounded-2xl font-bold text-xl hover:scale-110 hover:shadow-2xl transition-all duration-300 active:scale-95 animate-scale-in"
            style={{ animationDelay: '0.2s' }}
          >
            <span className="mr-3 text-2xl">💬</span>
            Start Your Custom Order
            <svg className="w-7 h-7 ml-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>
    </div>
  );
}

// Stat Item Component
function StatItem({ number, label }) {
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-bold text-rust-600 mb-1">{number}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
}

// Collage Item Component
function CollageItem({ src, alt, label }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-500 hover:-translate-y-1" style={{ minHeight: '130px' }}>
      <img src={src} alt={alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-rust-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <span className="text-white font-bold text-xs">{label}</span>
      </div>
    </div>
  );
}

// Modern Feature Card Component
function ModernFeatureCard({ icon, title, description, color, delay }) {
  return (
    <div 
      className="group relative animate-scale-in"
      style={{ animationDelay: delay }}
    >
      {/* Glow Effect */}
      <div className={`absolute -inset-1 bg-gradient-to-r ${color} rounded-3xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500`}></div>
      
      {/* Card */}
      <div className="relative bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-cream-200 group-hover:border-transparent group-hover:-translate-y-2">
        <div className="text-7xl mb-6 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 inline-block">
          {icon}
        </div>
        <h3 className="text-2xl font-display font-bold text-rust-600 mb-4">{title}</h3>
        <p className="text-gray-600 leading-relaxed text-lg">{description}</p>
        
        {/* Decorative Corner */}
        <div className={`absolute top-4 right-4 w-16 h-16 bg-gradient-to-br ${color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity`}></div>
      </div>
    </div>
  );
}

export default Home;
