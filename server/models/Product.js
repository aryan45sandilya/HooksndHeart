const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Product description is required']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['bags', 'toys', 'home-decor', 'accessories', 'clothing', 'other'],
    default: 'other'
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    publicId: {
      type: String // Cloudinary public ID for deletion
    }
  }],
  inStock: {
    type: Boolean,
    default: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  tags: [String]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
