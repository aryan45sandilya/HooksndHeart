@echo off
echo 🧶 Crochet Brand Website - Quick Setup
echo ======================================
echo.

REM Step 1: Install root dependencies
echo 📦 Installing root dependencies...
call npm install

REM Step 2: Install server dependencies
echo 📦 Installing server dependencies...
cd server
call npm install

REM Step 3: Create .env file
echo ⚙️  Creating .env file...
(
echo PORT=5000
echo MONGODB_URI=mongodb://localhost:27017/crochet-brand
echo CLOUDINARY_CLOUD_NAME=demo
echo CLOUDINARY_API_KEY=demo
echo CLOUDINARY_API_SECRET=demo
echo USE_LOCAL_STORAGE=true
) > .env

echo ✅ .env file created in server folder
cd ..

REM Step 4: Install client dependencies
echo 📦 Installing client dependencies...
cd client
call npm install
cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 🚀 To start the application, run:
echo    npm run dev
echo.
echo 📝 Note: Using local storage for images (no MongoDB/Cloudinary needed for now)
echo 📚 For production setup, read SETUP_GUIDE.md
pause
