import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@portfolio.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email:', existingAdmin.email);
      console.log('Name:', existingAdmin.name);
      process.exit(0);
    }

    // Create new admin user
    const adminData = {
      name: 'Portfolio Admin',
      email: 'admin@portfolio.com',
      password: 'admin123456', // This will be hashed automatically
      role: 'super_admin',
      isActive: true
    };

    const admin = new Admin(adminData);
    await admin.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', admin.email);
    console.log('🔑 Password: admin123456');
    console.log('👤 Name:', admin.name);
    console.log('🛡️ Role:', admin.role);
    console.log('\n⚠️  Please change the password after first login!');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
createAdminUser();
