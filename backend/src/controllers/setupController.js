import Admin from '../models/Admin.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiError.js';

/**
 * @desc    Create initial admin user (for setup only)
 * @route   POST /api/setup/admin
 * @access  Public (only works if no admin exists)
 */
const createInitialAdmin = asyncHandler(async (req, res) => {
  // Check if any admin already exists
  const existingAdmin = await Admin.findOne({});

  if (existingAdmin) {
    throw new ApiError(400, 'Admin user already exists. Setup not needed.', [], 'ADMIN_EXISTS');
  }

  // Create the initial admin user
  const adminData = {
    name: 'Portfolio Admin',
    email: 'admin@portfolio.com',
    password: 'admin123456', // This will be hashed automatically
    role: 'super_admin',
    isActive: true
  };

  const admin = new Admin(adminData);
  await admin.save();

  res.status(201).json(
    new ApiResponse(201, {
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      },
      credentials: {
        email: 'admin@portfolio.com',
        password: 'admin123456'
      }
    }, 'Initial admin user created successfully!')
  );
});

/**
 * @desc    Check if initial setup is needed
 * @route   GET /api/setup/status
 * @access  Public
 */
const checkSetupStatus = asyncHandler(async (req, res) => {
  const adminCount = await Admin.countDocuments({});

  res.status(200).json(
    new ApiResponse(200, {
      setupNeeded: adminCount === 0,
      adminCount: adminCount
    }, 'Setup status retrieved successfully')
  );
});

export {
  createInitialAdmin,
  checkSetupStatus
};
