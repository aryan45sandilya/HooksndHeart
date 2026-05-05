const Product = require('../models/Product');
const { cloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');

// In-memory storage fallback (when MongoDB is not connected)
let inMemoryProducts = [];
let productIdCounter = 1;

// Helper function to check if MongoDB is connected
const isMongoConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const { category, featured, inStock } = req.query;
    
    let products;
    
    if (isMongoConnected()) {
      // Use MongoDB
      const filter = {};
      if (category) filter.category = category;
      if (featured) filter.featured = featured === 'true';
      if (inStock) filter.inStock = inStock === 'true';
      products = await Product.find(filter).sort({ createdAt: -1 });
    } else {
      // Use in-memory storage
      products = [...inMemoryProducts];
      if (category) products = products.filter(p => p.category === category);
      if (featured) products = products.filter(p => p.featured === (featured === 'true'));
      if (inStock) products = products.filter(p => p.inStock === (inStock === 'true'));
      products.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    
    res.json({
      success: true,
      count: products.length,
      data: products,
      storage: isMongoConnected() ? 'mongodb' : 'memory'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    let product;
    
    if (isMongoConnected()) {
      product = await Product.findById(req.params.id);
    } else {
      product = inMemoryProducts.find(p => p._id === req.params.id);
    }
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
};

// Create product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, category, inStock, featured, tags } = req.body;

    // Process uploaded images
    const images = req.files ? req.files.map(file => ({
      url: `/uploads/${file.filename}`, // Local path for serving
      publicId: file.filename // Local filename
    })) : [];

    const product = await Product.create({
      name,
      description,
      price,
      category,
      images,
      inStock: inStock === 'true' || inStock === true,
      featured: featured === 'true' || featured === true,
      tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    const { name, description, price, category, inStock, featured, tags } = req.body;

    // Update fields
    if (name) product.name = name;
    if (description) product.description = description;
    if (price) product.price = price;
    if (category) product.category = category;
    if (inStock !== undefined) product.inStock = inStock === 'true' || inStock === true;
    if (featured !== undefined) product.featured = featured === 'true' || featured === true;
    if (tags) product.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => ({
        url: `/uploads/${file.filename}`,
        publicId: file.filename
      }));
      product.images.push(...newImages);
    }

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete images from Cloudinary
    if (process.env.USE_LOCAL_STORAGE !== 'true') {
      for (const image of product.images) {
        if (image.publicId) {
          await cloudinary.uploader.destroy(image.publicId);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
};
