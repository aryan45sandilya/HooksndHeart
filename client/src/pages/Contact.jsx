import { useState } from 'react';
import { contactAPI } from '../services/api';

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream-50 via-golden-50/30 to-coral-50/30">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-rust-500 via-rust-600 to-rust-500 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-golden-400/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-coral-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-block mb-6 animate-bounce-slow">
            <span className="text-7xl">💬</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-bold mb-6 animate-slide-up">
            Let's Connect
          </h1>
          <p className="text-xl md:text-2xl text-cream-100 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Have questions or want a custom creation? We'd love to hear from you!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-5xl mx-auto">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <ContactCard 
              icon="📱" 
              title="Call Us" 
              content="+91 88266 28029"
              link="tel:+918826628029"
              delay="0s"
            />
            <ContactCard 
              icon="📱" 
              title="WhatsApp" 
              content="+91 99716 70277"
              link="tel:+919971670277"
              delay="0.1s"
            />
            <ContactCard 
              icon="📷" 
              title="Instagram" 
              content="@hooksndheart"
              link="https://www.instagram.com/hooksndheart?igsh=bjhnbG82Zmg5OWZq"
              delay="0.2s"
            />
          </div>

          {/* Contact Form - Premium Design */}
          <div className="relative animate-scale-in" style={{ animationDelay: '0.3s' }}>
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-r from-coral-400 via-golden-400 to-teal-400 rounded-3xl blur-2xl opacity-20"></div>
            
            {/* Form Card */}
            <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-cream-200">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-display font-bold text-rust-600 mb-3">
                  Send Us a Message
                </h2>
                <p className="text-lg text-gray-600">
                  Fill out the form below and we'll get back to you within 24 hours
                </p>
              </div>
              
              {success && (
                <div className="bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-400 text-green-700 px-6 py-4 rounded-2xl mb-6 animate-slide-down flex items-center">
                  <span className="text-3xl mr-4">✅</span>
                  <div>
                    <p className="font-bold">Success!</p>
                    <p>Thank you for contacting us! We'll get back to you soon.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-gradient-to-r from-red-50 to-coral-50 border-2 border-red-400 text-red-700 px-6 py-4 rounded-2xl mb-6 animate-slide-down flex items-center">
                  <span className="text-3xl mr-4">❌</span>
                  <div>
                    <p className="font-bold">Oops!</p>
                    <p>{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <span className="mr-2">👤</span>
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Your name"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                      <span className="mr-2">📧</span>
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                    <span className="mr-2">📱</span>
                    Phone (Optional)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="+91 88266 28029"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-semibold mb-2 flex items-center">
                    <span className="mr-2">💭</span>
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="6"
                    className="input-field resize-none"
                    placeholder="Tell us about your requirements, custom orders, or any questions you have..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-10 py-5 bg-gradient-to-r from-rust-500 to-rust-600 text-white rounded-2xl font-bold text-lg hover:scale-105 hover:shadow-2xl hover:shadow-rust-500/50 transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">📨</span>
                      Send Message
                    </>
                  )}
                </button>
              </form>

              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-coral-400 to-golden-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-gradient-to-br from-teal-400 to-rust-400 rounded-full opacity-20 blur-xl"></div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 text-center animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <p className="text-lg text-gray-600 mb-4">
              <span className="font-bold text-rust-600">Business Hours:</span> Monday - Saturday, 10:00 AM - 7:00 PM
            </p>
            <p className="text-gray-600">
              We typically respond within 24 hours. For urgent inquiries, please call us directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Contact Card Component
function ContactCard({ icon, title, content, link, delay }) {
  const CardContent = (
    <div className="relative bg-white rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-cream-200 group-hover:border-transparent group-hover:-translate-y-2 text-center">
      <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {icon}
      </div>
      <h3 className="text-xl font-display font-bold text-rust-600 mb-2">{title}</h3>
      <p className="text-gray-600">{content}</p>
    </div>
  );

  return (
    <div 
      className="group relative animate-scale-in"
      style={{ animationDelay: delay }}
    >
      <div className="absolute -inset-1 bg-gradient-to-r from-rust-400 to-coral-400 rounded-3xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
      
      {link ? (
        <a href={link} target={link.startsWith('http') ? '_blank' : undefined} rel={link.startsWith('http') ? 'noopener noreferrer' : undefined}>
          {CardContent}
        </a>
      ) : (
        CardContent
      )}
    </div>
  );
}

export default Contact;
