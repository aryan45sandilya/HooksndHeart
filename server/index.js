const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for local image storage)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// MongoDB Connection (optional - will work without it)
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hooksnheart', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds
      socketTimeoutMS: 45000,
    });
    console.log('✅ MongoDB connected successfully');
    console.log('📦 Data will be saved permanently');
  } catch (err) {
    console.log('⚠️  MongoDB not connected - Server will still work!');
    console.log('   Reason:', err.message);
    console.log('   💡 Fix: Check internet connection or install MongoDB locally');
    console.log('   📝 Products will be stored temporarily (lost on restart)');
  }
};

connectDB().then(async () => {
  // Auto-create admin in production if not exists
  if (process.env.CREATE_ADMIN === 'true') {
    try {
      const Admin = require('./models/Admin');
      const existing = await Admin.findOne({ username: 'admin' });
      if (!existing) {
        await Admin.create({
          username: 'admin',
          email: 'admin@hooksndheart.com',
          password: 'admin123',
          role: 'superadmin'
        });
        console.log('✅ Admin created: username=admin, password=admin123');
      } else {
        console.log('ℹ️  Admin already exists');
      }
    } catch (e) {
      console.error('Admin create error:', e.message);
    }
  }
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/products', require('./routes/products'));
app.use('/api/contact', require('./routes/contact'));
app.use('/api/settings', require('./routes/settings'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`\n💡 Tip: Install MongoDB locally or fix internet connection for persistent data storage`);
});
