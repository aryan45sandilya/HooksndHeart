#!/bin/bash

echo "🧶 Crochet Brand Website - Quick Setup"
echo "======================================"
echo ""

# Step 1: Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Step 2: Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Step 3: Create .env file
echo "⚙️  Creating .env file..."
cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/crochet-brand
CLOUDINARY_CLOUD_NAME=demo
CLOUDINARY_API_KEY=demo
CLOUDINARY_API_SECRET=demo
USE_LOCAL_STORAGE=true
EOF

echo "✅ .env file created in server folder"
cd ..

# Step 4: Install client dependencies
echo "📦 Installing client dependencies..."
cd client
npm install
cd ..

echo ""
echo "✅ Setup Complete!"
echo ""
echo "🚀 To start the application, run:"
echo "   npm run dev"
echo ""
echo "📝 Note: Using local storage for images (no MongoDB/Cloudinary needed for now)"
echo "📚 For production setup, read SETUP_GUIDE.md"
