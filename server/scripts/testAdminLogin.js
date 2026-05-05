const mongoose = require('mongoose');
const Admin = require('../models/Admin');
require('dotenv').config();

const testAdminLogin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hooksnheart');
    console.log('✅ Connected to MongoDB\n');

    // Check if admin exists
    const admin = await Admin.findOne({ username: 'admin' }).select('+password');
    
    if (!admin) {
      console.log('❌ Admin user NOT found in database!');
      console.log('\n📝 Run this command to create admin:');
      console.log('   node scripts/createAdmin.js\n');
      process.exit(1);
    }

    console.log('✅ Admin user found!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Active:', admin.isActive);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

    // Test password
    const testPassword = 'admin123';
    const isMatch = await admin.comparePassword(testPassword);
    
    if (isMatch) {
      console.log('✅ Password verification: SUCCESS');
      console.log(`   Password "${testPassword}" is correct!\n`);
    } else {
      console.log('❌ Password verification: FAILED');
      console.log(`   Password "${testPassword}" is incorrect!\n`);
      console.log('💡 To reset password, delete admin and recreate:');
      console.log('   1. mongosh');
      console.log('   2. use hooksnheart');
      console.log('   3. db.admins.deleteMany({})');
      console.log('   4. exit');
      console.log('   5. node scripts/createAdmin.js\n');
    }

    console.log('🔗 Login URL: http://localhost:3001/login');
    console.log('👤 Username: admin');
    console.log('🔑 Password: admin123\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Make sure MongoDB is running:');
    console.log('   Windows: net start MongoDB');
    console.log('   Mac/Linux: sudo systemctl start mongod\n');
    process.exit(1);
  }
};

testAdminLogin();
