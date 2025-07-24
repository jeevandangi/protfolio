import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Admin from '../models/Admin.js';

// Load environment variables
dotenv.config({ path: '../.env' });

const listAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Get all admin users
    const admins = await Admin.find({}).select('name email role isActive createdAt');
    
    console.log('\n📋 Admin Users in Database:');
    console.log('================================');
    
    if (admins.length === 0) {
      console.log('No admin users found.');
    } else {
      admins.forEach((admin, index) => {
        console.log(`${index + 1}. ${admin.name}`);
        console.log(`   📧 Email: ${admin.email}`);
        console.log(`   🛡️  Role: ${admin.role}`);
        console.log(`   ✅ Active: ${admin.isActive}`);
        console.log(`   📅 Created: ${admin.createdAt}`);
        console.log('   ─────────────────────────');
      });
    }

  } catch (error) {
    console.error('❌ Error listing admin users:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
};

// Run the script
listAdmins();
